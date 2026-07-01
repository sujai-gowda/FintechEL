export const PRIVACY_LEVELS = [
  { value: 'PUBLIC', label: 'Public', description: 'Visible to all freelancers' },
  { value: 'PRIVATE', label: 'Private', description: 'Only invited freelancers can view' },
  { value: 'CONFIDENTIAL', label: 'Confidential', description: 'NDA required, limited access' },
];

export const FINANCE_STEPS = [
  { step: 1, title: 'Create Wallet', description: 'Set up your INR wallet with a secure PIN' },
  { step: 2, title: 'Add Funds', description: 'Top up via UPI / card simulation with PIN' },
  { step: 3, title: 'Fund Escrow', description: 'Lock project payment until work is approved' },
  { step: 4, title: 'Release Payment', description: 'Freelancer receives ₹ on approval' },
];
