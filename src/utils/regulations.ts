import { RegulationInfo } from '../types';

// 현재 규제 정보 (2024년 기준)
export const currentRegulations: RegulationInfo = {
  ltvRegulations: {
    '투기과열지구': {
      '무주택자': 50,
      '1주택자': 40,
      '다주택자': 30,
    },
    '조정대상지역': {
      '무주택자': 60,
      '1주택자': 50,
      '다주택자': 40,
    },
    '기타지역': {
      '무주택자': 70,
      '1주택자': 60,
      '다주택자': 50,
    },
  },
  dsrLimit: 40, // DSR 한도 40%
};

// LTV 비율 계산
export const calculateLTVRatio = (region: string, houseOwnership: string): number => {
  return currentRegulations.ltvRegulations[region]?.[houseOwnership] || 0;
};

// 월 원리금 상환액 계산 (원리금균등분할상환)
export const calculateMonthlyPayment = (
  principal: number,
  annualInterestRate: number,
  termYears: number
): number => {
  const monthlyInterestRate = annualInterestRate / 100 / 12;
  const totalPayments = termYears * 12;
  
  if (monthlyInterestRate === 0) {
    return principal / totalPayments;
  }
  
  const monthlyPayment = principal * 
    (monthlyInterestRate * Math.pow(1 + monthlyInterestRate, totalPayments)) /
    (Math.pow(1 + monthlyInterestRate, totalPayments) - 1);
  
  return monthlyPayment;
};

// 연간 원리금 상환액 계산
export const calculateAnnualPayment = (
  principal: number,
  annualInterestRate: number,
  termYears: number,
  repaymentType: string
): number => {
  let monthlyPayment: number;
  
  switch (repaymentType) {
    case '원리금균등분할상환':
      monthlyPayment = calculateMonthlyPayment(principal, annualInterestRate, termYears);
      break;
    case '원금균등분할상환':
      const monthlyPrincipal = principal / (termYears * 12);
      const monthlyInterest = (principal * annualInterestRate / 100) / 12;
      monthlyPayment = monthlyPrincipal + monthlyInterest;
      break;
    case '만기일시상환':
      monthlyPayment = (principal * annualInterestRate / 100) / 12;
      break;
    default:
      monthlyPayment = calculateMonthlyPayment(principal, annualInterestRate, termYears);
  }
  
  return monthlyPayment * 12;
}; 