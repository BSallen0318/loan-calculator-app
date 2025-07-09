import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  ScrollView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface HomeScreenProps {
  onNavigateToLTV: () => void;
  onNavigateToDSR: () => void;
}

const HomeScreen: React.FC<HomeScreenProps> = ({
  onNavigateToLTV,
  onNavigateToDSR,
}) => {
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Text style={styles.title}>내 대출 한도 계산기</Text>
          <Text style={styles.subtitle}>
            LTV와 DSR을 쉽고 정확하게 계산해보세요
          </Text>
        </View>

        <View style={styles.featureSection}>
          <TouchableOpacity style={styles.featureCard} onPress={onNavigateToLTV}>
            <View style={styles.featureIcon}>
              <Ionicons name="home-outline" size={32} color="#007AFF" />
            </View>
            <View style={styles.featureContent}>
              <Text style={styles.featureTitle}>LTV 계산기</Text>
              <Text style={styles.featureDescription}>
                주택담보대출비율을 계산하여 최대 대출 가능 금액을 확인하세요
              </Text>
            </View>
            <Ionicons name="chevron-forward" size={24} color="#999" />
          </TouchableOpacity>

          <TouchableOpacity style={styles.featureCard} onPress={onNavigateToDSR}>
            <View style={styles.featureIcon}>
              <Ionicons name="calculator-outline" size={32} color="#007AFF" />
            </View>
            <View style={styles.featureContent}>
              <Text style={styles.featureTitle}>DSR 계산기</Text>
              <Text style={styles.featureDescription}>
                총부채원리금상환비율을 계산하여 대출 가능 여부를 확인하세요
              </Text>
            </View>
            <Ionicons name="chevron-forward" size={24} color="#999" />
          </TouchableOpacity>
        </View>

        <View style={styles.infoSection}>
          <Text style={styles.infoTitle}>💡 계산기 사용법</Text>
          <View style={styles.infoItem}>
            <Text style={styles.infoNumber}>1</Text>
            <Text style={styles.infoText}>
              LTV 계산기에서 주택 정보를 입력하여 최대 대출 가능 금액을 확인합니다
            </Text>
          </View>
          <View style={styles.infoItem}>
            <Text style={styles.infoNumber}>2</Text>
            <Text style={styles.infoText}>
              DSR 계산기에서 소득과 부채 정보를 입력하여 대출 가능 여부를 확인합니다
            </Text>
          </View>
          <View style={styles.infoItem}>
            <Text style={styles.infoNumber}>3</Text>
            <Text style={styles.infoText}>
              계산 결과를 공유하거나 다시 계산할 수 있습니다
            </Text>
          </View>
        </View>

        <View style={styles.regulationSection}>
          <Text style={styles.regulationTitle}>📋 현재 규제 기준</Text>
          <View style={styles.regulationCard}>
            <Text style={styles.regulationSubtitle}>LTV (주택담보대출비율)</Text>
            <Text style={styles.regulationText}>
              • 투기과열지구: 무주택자 50%, 1주택자 40%, 다주택자 30%
            </Text>
            <Text style={styles.regulationText}>
              • 조정대상지역: 무주택자 60%, 1주택자 50%, 다주택자 40%
            </Text>
            <Text style={styles.regulationText}>
              • 기타지역: 무주택자 70%, 1주택자 60%, 다주택자 50%
            </Text>
          </View>
          <View style={styles.regulationCard}>
            <Text style={styles.regulationSubtitle}>DSR (총부채원리금상환비율)</Text>
            <Text style={styles.regulationText}>
              • 대출 한도: 40% (연간 소득 대비 총 부채 원리금 상환액)
            </Text>
          </View>
        </View>

        <View style={styles.disclaimerSection}>
          <Text style={styles.disclaimerTitle}>⚠️ 주의사항</Text>
          <Text style={styles.disclaimerText}>
            이 계산 결과는 참고용이며, 실제 대출 한도는 은행의 심사 결과에 따라 달라질 수 있습니다. 
            정확한 대출 상담을 위해서는 은행에 직접 문의하시기 바랍니다.
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  scrollView: {
    flex: 1,
  },
  header: {
    backgroundColor: 'white',
    padding: 24,
    borderBottomWidth: 1,
    borderBottomColor: '#e9ecef',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    lineHeight: 24,
  },
  featureSection: {
    padding: 16,
  },
  featureCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 20,
    marginBottom: 16,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  featureIcon: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#F0F8FF',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  featureContent: {
    flex: 1,
  },
  featureTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  featureDescription: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
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
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 16,
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  infoNumber: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#007AFF',
    color: 'white',
    textAlign: 'center',
    lineHeight: 24,
    fontSize: 14,
    fontWeight: 'bold',
    marginRight: 12,
  },
  infoText: {
    flex: 1,
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
  },
  regulationSection: {
    padding: 16,
  },
  regulationTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 16,
  },
  regulationCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  regulationSubtitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  regulationText: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
    marginBottom: 4,
  },
  disclaimerSection: {
    backgroundColor: '#FFF3CD',
    margin: 16,
    padding: 20,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#FFEAA7',
  },
  disclaimerTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#856404',
    marginBottom: 8,
  },
  disclaimerText: {
    fontSize: 14,
    color: '#856404',
    lineHeight: 20,
  },
});

export default HomeScreen; 