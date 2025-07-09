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
import { LTVInput, LTVResult } from '../types';
import { calculateLTVRatio } from '../utils/regulations';
import Tooltip from './Tooltip';

interface LTVCalculatorProps {
  onCalculate: (result: LTVResult) => void;
}

const LTVCalculator: React.FC<LTVCalculatorProps> = ({ onCalculate }) => {
  const [inputs, setInputs] = useState<LTVInput>({
    housePrice: 0,
    region: '기타지역',
    houseOwnership: '무주택자',
  });
  const [showRegionPicker, setShowRegionPicker] = useState(false);
  const [showOwnershipPicker, setShowOwnershipPicker] = useState(false);

  const regions = ['투기과열지구', '조정대상지역', '기타지역'];
  const ownerships = ['무주택자', '1주택자', '다주택자'];

  const handleCalculate = () => {
    if (inputs.housePrice <= 0) {
      Alert.alert('오류', '주택 가격을 입력해주세요.');
      return;
    }

    const ltvRatio = calculateLTVRatio(inputs.region, inputs.houseOwnership);
    const maxLoanAmount = (inputs.housePrice * ltvRatio) / 100;

    const result: LTVResult = {
      ltvRatio,
      maxLoanAmount,
    };

    onCalculate(result);
  };

  const formatNumber = (num: number): string => {
    return num.toLocaleString('ko-KR');
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.header}>
        <Text style={styles.title}>LTV 계산기</Text>
        <View style={styles.titleRow}>
          <Text style={styles.subtitle}>주택담보대출비율</Text>
          <Tooltip
            term="LTV (주택담보대출비율)"
            explanation="주택 가격 대비 대출 가능한 최대 비율을 의미합니다. 지역과 주택 보유 현황에 따라 다르게 적용됩니다."
          />
        </View>
      </View>

      <View style={styles.inputSection}>
        <Text style={styles.sectionTitle}>주택 정보</Text>
        
        <View style={styles.inputGroup}>
          <Text style={styles.label}>주택 가격 (만원)</Text>
          <TextInput
            style={styles.input}
            value={inputs.housePrice > 0 ? inputs.housePrice.toString() : ''}
            onChangeText={(text) => setInputs({
              ...inputs,
              housePrice: parseInt(text) || 0
            })}
            placeholder="예: 50000"
            keyboardType="numeric"
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>주택 소재지</Text>
          <TouchableOpacity
            style={styles.pickerContainer}
            onPress={() => setShowRegionPicker(true)}
          >
            <Text style={styles.pickerText}>{inputs.region}</Text>
            <Ionicons name="chevron-down" size={20} color="#666" />
          </TouchableOpacity>
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>주택 보유 현황</Text>
          <TouchableOpacity
            style={styles.pickerContainer}
            onPress={() => setShowOwnershipPicker(true)}
          >
            <Text style={styles.pickerText}>{inputs.houseOwnership}</Text>
            <Ionicons name="chevron-down" size={20} color="#666" />
          </TouchableOpacity>
        </View>
      </View>

      <TouchableOpacity style={styles.calculateButton} onPress={handleCalculate}>
        <Ionicons name="calculator-outline" size={24} color="white" />
        <Text style={styles.calculateButtonText}>LTV 계산하기</Text>
      </TouchableOpacity>

      <View style={styles.infoSection}>
        <Text style={styles.infoTitle}>현재 규제 기준</Text>
        <Text style={styles.infoText}>
          • 투기과열지구: 무주택자 50%, 1주택자 40%, 다주택자 30%
        </Text>
        <Text style={styles.infoText}>
          • 조정대상지역: 무주택자 60%, 1주택자 50%, 다주택자 40%
        </Text>
        <Text style={styles.infoText}>
          • 기타지역: 무주택자 70%, 1주택자 60%, 다주택자 50%
        </Text>
      </View>

      {/* 지역 선택 모달 */}
      <Modal
        visible={showRegionPicker}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setShowRegionPicker(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>주택 소재지 선택</Text>
              <TouchableOpacity onPress={() => setShowRegionPicker(false)}>
                <Ionicons name="close" size={24} color="#666" />
              </TouchableOpacity>
            </View>
            {regions.map((region) => (
              <TouchableOpacity
                key={region}
                style={styles.modalItem}
                onPress={() => {
                  setInputs({ ...inputs, region: region as any });
                  setShowRegionPicker(false);
                }}
              >
                <Text style={styles.modalItemText}>{region}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </Modal>

      {/* 주택 보유 현황 선택 모달 */}
      <Modal
        visible={showOwnershipPicker}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setShowOwnershipPicker(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>주택 보유 현황 선택</Text>
              <TouchableOpacity onPress={() => setShowOwnershipPicker(false)}>
                <Ionicons name="close" size={24} color="#666" />
              </TouchableOpacity>
            </View>
            {ownerships.map((ownership) => (
              <TouchableOpacity
                key={ownership}
                style={styles.modalItem}
                onPress={() => {
                  setInputs({ ...inputs, houseOwnership: ownership as any });
                  setShowOwnershipPicker(false);
                }}
              >
                <Text style={styles.modalItemText}>{ownership}</Text>
              </TouchableOpacity>
            ))}
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
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 16,
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
    maxHeight: '50%',
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
});

export default LTVCalculator; 