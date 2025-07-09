// LTV 관련 타입
export interface LTVInput {
  housePrice: number;
  region: '투기과열지구' | '조정대상지역' | '기타지역';
  houseOwnership: '무주택자' | '1주택자' | '다주택자';
}

export interface LTVResult {
  ltvRatio: number;
  maxLoanAmount: number;
}

// DSR 관련 타입
export interface LoanInfo {
  principal: number;
  interestRate: number;
  term: number;
  repaymentType: '원리금균등분할상환' | '원금균등분할상환' | '만기일시상환';
}

export interface DSRInput {
  annualIncome: number;
  newLoan: LoanInfo;
  existingLoans: LoanInfo[];
}

export interface DSRResult {
  totalAnnualPayment: number;
  dsrRatio: number;
  isApproved: boolean;
}

// 규제 정보 타입
export interface RegulationInfo {
  ltvRegulations: {
    [key: string]: {
      [key: string]: number;
    };
  };
  dsrLimit: number;
} 