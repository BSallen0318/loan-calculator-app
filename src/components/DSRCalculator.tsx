import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
  Modal,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { DSRInput, DSRResult, LoanInfo } from '../types';
import { calculateAnnualPayment, currentRegulations } from '../utils/regulations';
import Tooltip from './Tooltip';

interface DSRCalculatorProps {
  ltvResult?: { maxLoanAmount: number };
  onCalculate: (result: DSRResult) => void;
}

const DSRCalculator: React.FC<DSRCalculatorProps> = ({ ltvResult, onCalculate }) => {
  const [inputs, setInputs] = useState<DSRInput>({
    annualIncome: 0,
    newLoan: {
      principal: ltvResult?.maxLoanAmount || 0,
      interestRate: 3.5,
      term: 30,
      repaymentType: '원리금균등분할상환',
    },
    existingLoans: [],
  });

  const [showRepaymentPicker, setShowRepaymentPicker] = useState(false);
  const [showAddLoanModal, setShowAddLoanModal] = useState(false);
  const [newExistingLoan, setNewExistingLoan] = useState<LoanInfo>({
    principal: 0,
    interestRate: 0,
    term: 0,
    repaymentType: '원리금균등분할상환',
  });

  const repaymentTypes = ['원리금균등분할상환', '원금균등분할상환', '만기일시상환'];

  const handleCalculate = () => {
    if (inputs.annualIncome <= 0) {
      Alert.alert('오류', '연 소득을 입력해주세요.');
      return;
    }

    if (inputs.newLoan.principal <= 0) {
      Alert.alert('오류', '신규 대출 원금을 입력해주세요.');
      return;
    }

    // 신규 대출 연간 상환액 계산
    const newLoanAnnualPayment = calculateAnnualPayment(
      inputs.newLoan.principal,
      inputs.newLoan.interestRate,
      inputs.newLoan.term,
      inputs.newLoan.repaymentType
    );

    // 기존 대출 연간 상환액 계산
    const existingLoansAnnualPayment = inputs.existingLoans.reduce((total, loan) => {
      return total + calculateAnnualPayment(
        loan.principal,
        loan.interestRate,
        loan.term,
        loan.repaymentType
      );
    }, 0);

    const totalAnnualPayment = newLoanAnnualPayment + existingLoansAnnualPayment;
    const dsrRatio = (totalAnnualPayment / inputs.annualIncome) * 100;
    const isApproved = dsrRatio <= currentRegulations.dsrLimit;

    const result: DSRResult = {
      totalAnnualPayment,
      dsrRatio,
      isApproved,
    };

    onCalculate(result);
  };

  const addExistingLoan = () => {
    if (newExistingLoan.principal <= 0 || newExistingLoan.interestRate <= 0 || newExistingLoan.term <= 0) {
      Alert.alert('오류', '모든 필드를 입력해주세요.');
      return;
    }

    setInputs({
      ...inputs,
      existingLoans: [...inputs.existingLoans, newExistingLoan],
    });

    setNewExistingLoan({
      principal: 0,
      interestRate: 0,
      term: 0,
      repaymentType: '원리금균등분할상환',
    });
    setShowAddLoanModal(false);
  };

  const removeExistingLoan = (index: number) => {
    const updatedLoans = inputs.existingLoans.filter((_, i) => i !== index);
    setInputs({
      ...inputs,
      existingLoans: updatedLoans,
    });
  };

  const formatNumber = (num: number): string => {
    return num.toLocaleString('ko-KR');
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.header}>
        <Text style={styles.title}>DSR 계산기</Text>
        <View style={styles.titleRow}>
          <Text style={styles.subtitle}>총부채원리금상환비율</Text>
          <Tooltip
            term="DSR (총부채원리금상환비율)"
            explanation="연간 소득 대비 총 부채의 원리금 상환액 비율을 의미합니다. 현재 규제 한도는 40%입니다."
          />
        </View>
      </View>

      <View style={styles.inputSection}>
        <Text style={styles.sectionTitle}>소득 정보</Text>
        
        <View style={styles.inputGroup}>
          <Text style={styles.label}>연 소득 (세전, 만원)</Text>
          <TextInput
            style={styles.input}
            value={inputs.annualIncome > 0 ? inputs.annualIncome.toString() : ''}
            onChangeText={(text) => setInputs({
              ...inputs,
              annualIncome: parseInt(text) || 0
            })}
            placeholder="예: 5000"
            keyboardType="numeric"
          />
        </View>
      </View>

      <View style={styles.inputSection}>
        <Text style={styles.sectionTitle}>신규 대출 조건</Text>
        
        <View style={styles.inputGroup}>
          <Text style={styles.label}>대출 원금 (만원)</Text>
          <TextInput
            style={styles.input}
            value={inputs.newLoan.principal > 0 ? inputs.newLoan.principal.toString() : ''}
            onChangeText={(text) => setInputs({
              ...inputs,
              newLoan: {
                ...inputs.newLoan,
                principal: parseInt(text) || 0
              }
            })}
            placeholder="예: 30000"
            keyboardType="numeric"
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>대출 금리 (연, %)</Text>
          <TextInput
            style={styles.input}
            value={inputs.newLoan.interestRate > 0 ? inputs.newLoan.interestRate.toString() : ''}
            onChangeText={(text) => setInputs({
              ...inputs,
              newLoan: {
                ...inputs.newLoan,
                interestRate: parseFloat(text) || 0
              }
            })}
            placeholder="예: 3.5"
            keyboardType="numeric"
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>대출 기간 (년)</Text>
          <TextInput
            style={styles.input}
            value={inputs.newLoan.term > 0 ? inputs.newLoan.term.toString() : ''}
            onChangeText={(text) => setInputs({
              ...inputs,
              newLoan: {
                ...inputs.newLoan,
                term: parseInt(text) || 0
              }
            })}
            placeholder="예: 30"
            keyboardType="numeric"
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>상환 방식</Text>
          <TouchableOpacity
            style={styles.pickerContainer}
            onPress={() => setShowRepaymentPicker(true)}
          >
            <Text style={styles.pickerText}>{inputs.newLoan.repaymentType}</Text>
            <Ionicons name="chevron-down" size={20} color="#666" />
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.inputSection}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>기타 보유 대출</Text>
          <TouchableOpacity
            style={styles.addButton}
            onPress={() => setShowAddLoanModal(true)}
          >
            <Ionicons name="add" size={20} color="white" />
            <Text style={styles.addButtonText}>추가</Text>
          </TouchableOpacity>
        </View>

        {inputs.existingLoans.map((loan, index) => (
          <View key={index} style={styles.existingLoanItem}>
            <View style={styles.loanInfo}>
              <Text style={styles.loanTitle}>대출 {index + 1}</Text>
              <Text style={styles.loanDetails}>
                {formatNumber(loan.principal)}만원 / {loan.interestRate}% / {loan.term}년
              </Text>
              <Text style={styles.loanType}>{loan.repaymentType}</Text>
            </View>
            <TouchableOpacity
              style={styles.removeButton}
              onPress={() => removeExistingLoan(index)}
            >
              <Ionicons name="trash-outline" size={20} color="#FF3B30" />
            </TouchableOpacity>
          </View>
        ))}

        {inputs.existingLoans.length === 0 && (
          <Text style={styles.noLoansText}>보유한 기존 대출이 없습니다.</Text>
        )}
      </View>

      <TouchableOpacity style={styles.calculateButton} onPress={handleCalculate}>
        <Ionicons name="calculator-outline" size={24} color="white" />
        <Text style={styles.calculateButtonText}>DSR 계산하기</Text>
      </TouchableOpacity>

      <View style={styles.infoSection}>
        <Text style={styles.infoTitle}>현재 규제 기준</Text>
        <Text style={styles.infoText}>
          • DSR 한도: {currentRegulations.dsrLimit}%
        </Text>
        <Text style={styles.infoText}>
          • DSR = (연간 총부채 원리금 상환액 ÷ 연 소득) × 100
        </Text>
      </View>

      {/* 상환 방식 선택 모달 */}
      <Modal
        visible={showRepaymentPicker}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setShowRepaymentPicker(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>상환 방식 선택</Text>
              <TouchableOpacity onPress={() => setShowRepaymentPicker(false)}>
                <Ionicons name="close" size={24} color="#666" />
              </TouchableOpacity>
            </View>
            {repaymentTypes.map((type) => (
              <TouchableOpacity
                key={type}
                style={styles.modalItem}
                onPress={() => {
                  setInputs({
                    ...inputs,
                    newLoan: {
                      ...inputs.newLoan,
                      repaymentType: type as any
                    }
                  });
                  setShowRepaymentPicker(false);
                }}
              >
                <Text style={styles.modalItemText}>{type}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </Modal>

      {/* 기존 대출 추가 모달 */}
      <Modal
        visible={showAddLoanModal}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setShowAddLoanModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>기존 대출 추가</Text>
              <TouchableOpacity onPress={() => setShowAddLoanModal(false)}>
                <Ionicons name="close" size={24} color="#666" />
              </TouchableOpacity>
            </View>
            
            <View style={styles.inputGroup}>
              <Text style={styles.label}>대출 원금 (만원)</Text>
              <TextInput
                style={styles.input}
                value={newExistingLoan.principal > 0 ? newExistingLoan.principal.toString() : ''}
                onChangeText={(text) => setNewExistingLoan({
                  ...newExistingLoan,
                  principal: parseInt(text) || 0
                })}
                placeholder="예: 10000"
                keyboardType="numeric"
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>대출 금리 (연, %)</Text>
              <TextInput
                style={styles.input}
                value={newExistingLoan.interestRate > 0 ? newExistingLoan.interestRate.toString() : ''}
                onChangeText={(text) => setNewExistingLoan({
                  ...newExistingLoan,
                  interestRate: parseFloat(text) || 0
                })}
                placeholder="예: 4.0"
                keyboardType="numeric"
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>대출 기간 (년)</Text>
              <TextInput
                style={styles.input}
                value={newExistingLoan.term > 0 ? newExistingLoan.term.toString() : ''}
                onChangeText={(text) => setNewExistingLoan({
                  ...newExistingLoan,
                  term: parseInt(text) || 0
                })}
                placeholder="예: 20"
                keyboardType="numeric"
              />
            </View>

            <TouchableOpacity style={styles.addLoanButton} onPress={addExistingLoan}>
              <Text style={styles.addLoanButtonText}>대출 추가</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  header: {
    backgroundColor: 'white',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#e9ecef',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
  },
  inputSection: {
    backgroundColor: 'white',
    margin: 16,
    padding: 20,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    backgroundColor: 'white',
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    backgroundColor: 'white',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 12,
  },
  pickerText: {
    fontSize: 16,
    color: '#333',
  },
  addButton: {
    backgroundColor: '#007AFF',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
  },
  addButtonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
    marginLeft: 4,
  },
  existingLoanItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    backgroundColor: '#f8f9fa',
    borderRadius: 8,
    marginBottom: 8,
  },
  loanInfo: {
    flex: 1,
  },
  loanTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  loanDetails: {
    fontSize: 14,
    color: '#666',
    marginBottom: 2,
  },
  loanType: {
    fontSize: 12,
    color: '#999',
  },
  removeButton: {
    padding: 8,
  },
  noLoansText: {
    textAlign: 'center',
    color: '#999',
    fontStyle: 'italic',
    padding: 20,
  },
  calculateButton: {
    backgroundColor: '#007AFF',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    margin: 16,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  calculateButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
    marginLeft: 8,
  },
  infoSection: {
    backgroundColor: 'white',
    margin: 16,
    padding: 20,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  infoTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 12,
  },
  infoText: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
    marginBottom: 4,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: 'white',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    maxHeight: '70%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#e9ecef',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  modalItem: {
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  modalItemText: {
    fontSize: 16,
    color: '#333',
  },
  addLoanButton: {
    backgroundColor: '#007AFF',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 20,
  },
  addLoanButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default DSRCalculator; 