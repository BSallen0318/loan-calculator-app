import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Share,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LTVResult, DSRResult } from '../types';

interface ResultScreenProps {
  ltvResult?: LTVResult;
  dsrResult?: DSRResult;
  onBack: () => void;
  onRecalculate: () => void;
}

const ResultScreen: React.FC<ResultScreenProps> = ({
  ltvResult,
  dsrResult,
  onBack,
  onRecalculate,
}) => {
  const formatNumber = (num: number): string => {
    return num.toLocaleString('ko-KR');
  };

  const formatCurrency = (num: number): string => {
    return `${formatNumber(num)}만원`;
  };

  const handleShare = async () => {
    try {
      let shareText = '내 대출 한도 계산 결과\n\n';

      if (ltvResult) {
        shareText += `🏠 LTV 계산 결과\n`;
        shareText += `• 적용 LTV 비율: ${ltvResult.ltvRatio}%\n`;
        shareText += `• 최대 대출 가능 금액: ${formatCurrency(ltvResult.maxLoanAmount)}\n\n`;
      }

      if (dsrResult) {
        shareText += `💰 DSR 계산 결과\n`;
        shareText += `• 연간 총부채 원리금 상환액: ${formatCurrency(dsrResult.totalAnnualPayment)}\n`;
        shareText += `• DSR 비율: ${dsrResult.dsrRatio.toFixed(1)}%\n`;
        shareText += `• 대출 가능 여부: ${dsrResult.isApproved ? '✅ 대출 가능' : '❌ 규제 초과'}\n`;
      }

      await Share.share({
        message: shareText,
        title: '대출 한도 계산 결과',
      });
    } catch (error) {
      Alert.alert('오류', '공유하기에 실패했습니다.');
    }
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={onBack}>
          <Ionicons name="arrow-back" size={24} color="#007AFF" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>계산 결과</Text>
        <TouchableOpacity style={styles.shareButton} onPress={handleShare}>
          <Ionicons name="share-outline" size={24} color="#007AFF" />
        </TouchableOpacity>
      </View>

      {ltvResult && (
        <View style={styles.resultSection}>
          <View style={styles.sectionHeader}>
            <Ionicons name="home-outline" size={24} color="#007AFF" />
            <Text style={styles.sectionTitle}>LTV 계산 결과</Text>
          </View>
          
          <View style={styles.resultCard}>
            <View style={styles.resultRow}>
              <Text style={styles.resultLabel}>적용 LTV 비율</Text>
              <Text style={styles.resultValue}>{ltvResult.ltvRatio}%</Text>
            </View>
            
            <View style={styles.resultRow}>
              <Text style={styles.resultLabel}>최대 대출 가능 금액</Text>
              <Text style={styles.resultValue}>{formatCurrency(ltvResult.maxLoanAmount)}</Text>
            </View>
          </View>
        </View>
      )}

      {dsrResult && (
        <View style={styles.resultSection}>
          <View style={styles.sectionHeader}>
            <Ionicons name="calculator-outline" size={24} color="#007AFF" />
            <Text style={styles.sectionTitle}>DSR 계산 결과</Text>
          </View>
          
          <View style={styles.resultCard}>
            <View style={styles.resultRow}>
              <Text style={styles.resultLabel}>연간 총부채 원리금 상환액</Text>
              <Text style={styles.resultValue}>{formatCurrency(dsrResult.totalAnnualPayment)}</Text>
            </View>
            
            <View style={styles.resultRow}>
              <Text style={styles.resultLabel}>DSR 비율</Text>
              <Text style={styles.resultValue}>{dsrResult.dsrRatio.toFixed(1)}%</Text>
            </View>
            
            <View style={styles.resultRow}>
              <Text style={styles.resultLabel}>대출 가능 여부</Text>
              <View style={styles.approvalContainer}>
                <Text style={[
                  styles.approvalText,
                  { color: dsrResult.isApproved ? '#34C759' : '#FF3B30' }
                ]}>
                  {dsrResult.isApproved ? '✅ 대출 가능' : '❌ 규제 초과'}
                </Text>
              </View>
            </View>
          </View>

          {!dsrResult.isApproved && (
            <View style={styles.warningCard}>
              <Ionicons name="warning-outline" size={24} color="#FF9500" />
              <Text style={styles.warningText}>
                DSR이 40%를 초과하여 대출이 제한될 수 있습니다.
              </Text>
            </View>
          )}
        </View>
      )}

      <View style={styles.actionSection}>
        <TouchableOpacity style={styles.recalculateButton} onPress={onRecalculate}>
          <Ionicons name="refresh-outline" size={24} color="white" />
          <Text style={styles.recalculateButtonText}>다시 계산하기</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.infoSection}>
        <Text style={styles.infoTitle}>참고사항</Text>
        <Text style={styles.infoText}>
          • 이 계산 결과는 참고용이며, 실제 대출 한도는 은행의 심사 결과에 따라 달라질 수 있습니다.
        </Text>
        <Text style={styles.infoText}>
          • 규제는 정부 정책에 따라 변경될 수 있으니 최신 정보를 확인하시기 바랍니다.
        </Text>
        <Text style={styles.infoText}>
          • 정확한 대출 상담을 위해서는 은행에 직접 문의하시기 바랍니다.
        </Text>
      </View>
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
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#e9ecef',
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  shareButton: {
    padding: 8,
  },
  resultSection: {
    margin: 16,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginLeft: 8,
  },
  resultCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  resultRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  resultLabel: {
    fontSize: 16,
    color: '#666',
    flex: 1,
  },
  resultValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'right',
  },
  approvalContainer: {
    alignItems: 'flex-end',
  },
  approvalText: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  warningCard: {
    backgroundColor: '#FFF3CD',
    borderColor: '#FFEAA7',
    borderWidth: 1,
    borderRadius: 8,
    padding: 16,
    marginTop: 12,
    flexDirection: 'row',
    alignItems: 'center',
  },
  warningText: {
    fontSize: 14,
    color: '#856404',
    marginLeft: 8,
    flex: 1,
  },
  actionSection: {
    margin: 16,
  },
  recalculateButton: {
    backgroundColor: '#007AFF',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  recalculateButtonText: {
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
    marginBottom: 8,
  },
});

export default ResultScreen; 