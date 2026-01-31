/**
 * Unrelated Payments Data
 *
 * FCA requires all payment services to have both Process Flow and Funds Flow diagrams.
 * This module contains templates and structures for generating these diagrams.
 */

export interface FlowStep {
  id: string;
  label: string;
  description: string;
  type: 'start' | 'process' | 'decision' | 'end' | 'external';
}

export interface FlowConnection {
  from: string;
  to: string;
  label?: string;
  condition?: string;
}

export interface FlowDiagram {
  title: string;
  description: string;
  steps: FlowStep[];
  connections: FlowConnection[];
  mermaidCode?: string;
}

export interface UnrelatedPayment {
  id: string;
  serviceNumber: string;
  serviceName: string;
  serviceDescription: string;
  businessModelDescription: string;
  processFlow: FlowDiagram;
  fundsFlow: FlowDiagram;
  keyControls: { area: string; control: string }[];
}

// Payment Service Templates
export const unrelatedPayments: UnrelatedPayment[] = [
  {
    id: 'service-1-cash-deposit',
    serviceNumber: '1',
    serviceName: 'Cash Deposits to Payment Account',
    serviceDescription: 'Services enabling cash to be placed on a payment account and all of the operations required for operating a payment account.',
    businessModelDescription: `The firm will enable end-users to load funds onto their e-money account via:
- PayPoint & PaysafeCash outlets – customers generate an in-app barcode and deposit cash
- Selected retail-partner kiosks – physical voucher top-ups

Once deposited, funds are available within 10 minutes and customers can:
- View real-time balances and transaction history
- Download monthly e-statements
- Perform internal transfers between sub-accounts

All operations run through our reconciliation engine with automated AML/fraud monitoring.`,
    processFlow: {
      title: 'Cash Deposit Process Flow',
      description: 'Process flow for a customer topping up their account via cash deposit',
      steps: [
        { id: 'A', label: 'Customer generates barcode in app', description: 'Customer initiates top-up and generates unique barcode', type: 'start' },
        { id: 'B', label: 'Visits retail outlet / agent', description: 'Customer takes barcode to participating retail location', type: 'process' },
        { id: 'C', label: 'Cash accepted by cashier', description: 'Cashier accepts cash via Paysafe/PayPoint', type: 'process' },
        { id: 'D', label: 'Cash routed via network', description: 'Cash digitally routed through payment network', type: 'process' },
        { id: 'E', label: 'Funds credited to Principal Account', description: 'Funds transferred to firm principal bank account', type: 'process' },
        { id: 'F', label: 'Reconciliation engine confirms', description: 'System verifies successful receipt', type: 'process' },
        { id: 'G', label: 'User e-money ledger credited', description: 'Customer digital balance updated', type: 'process' },
        { id: 'H', label: 'Customer sees updated balance', description: 'Balance and transaction history visible in app', type: 'end' },
      ],
      connections: [
        { from: 'A', to: 'B' },
        { from: 'B', to: 'C' },
        { from: 'C', to: 'D' },
        { from: 'D', to: 'E' },
        { from: 'E', to: 'F' },
        { from: 'F', to: 'G' },
        { from: 'G', to: 'H' },
      ],
      mermaidCode: `flowchart TD
    A[Customer generates barcode in app] --> B[Visits retail outlet / agent]
    B --> C[Cash accepted by cashier<br/>Paysafe/PayPoint]
    C --> D[Cash routed via<br/>payment network]
    D --> E[Funds credited to<br/>Principal Bank Account]
    E --> F[Reconciliation engine<br/>confirms receipt]
    F --> G[User e-money ledger<br/>credited]
    G --> H[Customer sees updated<br/>balance & TX history]

    style A fill:#3b82f6,color:#fff
    style H fill:#22c55e,color:#fff
    style E fill:#d4af37,color:#000
    style F fill:#8b5cf6,color:#fff`,
    },
    fundsFlow: {
      title: 'Cash Deposit Funds Flow',
      description: 'Funds flow when customer uses cash to top up e-money wallet',
      steps: [
        { id: 'A', label: 'Customer (cash)', description: 'Customer provides cash for top-up', type: 'start' },
        { id: 'B', label: 'Retailer / Agent', description: 'PayPoint, PaysafeCash outlet', type: 'external' },
        { id: 'C', label: 'Payment Network', description: 'Paysafe / PaysafeCash Network', type: 'external' },
        { id: 'D', label: 'Settlement Bank Account', description: 'Funds aggregated for transfer', type: 'process' },
        { id: 'E', label: 'Principal Account', description: 'Firm compliance principal account', type: 'process' },
        { id: 'F', label: 'e-Money Ledger & Vault', description: 'Digital tracking of balances', type: 'process' },
        { id: 'G', label: 'Customer e-money wallet', description: 'Funds available for use', type: 'end' },
      ],
      connections: [
        { from: 'A', to: 'B', label: 'Cash' },
        { from: 'B', to: 'C', label: 'Transaction data' },
        { from: 'C', to: 'D', label: 'Settlement' },
        { from: 'D', to: 'E', label: 'Transfer' },
        { from: 'E', to: 'F', label: 'Allocation' },
        { from: 'F', to: 'G', label: 'Credit' },
      ],
      mermaidCode: `flowchart TD
    subgraph Client["Client Layer"]
        A[Customer<br/>💵 Cash]
    end

    subgraph Distribution["Distribution Layer"]
        B[Retailer / Agent<br/>PayPoint, PaysafeCash]
    end

    subgraph Network["Network Layer"]
        C[Paysafe / PaysafeCash<br/>Network]
    end

    subgraph Settlement["Settlement Layer"]
        D[Settlement<br/>Bank Account]
    end

    subgraph Issuer["E-Money Issuer Layer"]
        E[Principal<br/>Bank Account]
        F[e-Money Ledger<br/>& Vault System]
    end

    subgraph Customer["Customer Layer"]
        G[Customer<br/>e-money wallet]
    end

    A -->|Cash| B
    B -->|Transaction Data| C
    C -->|Settlement| D
    D -->|Transfer| E
    E -->|Allocation| F
    F -->|Credit| G

    style A fill:#3b82f6,color:#fff
    style G fill:#22c55e,color:#fff
    style E fill:#d4af37,color:#000`,
    },
    keyControls: [
      { area: 'Barcode validity', control: '30 minutes' },
      { area: 'Per-transaction limits', control: '£10 – £500' },
      { area: 'Daily cap', control: '£750' },
      { area: 'Fund availability', control: 'Typically <10 mins (max 30 mins)' },
      { area: 'Fees', control: '1.5% (waived on first £100/month)' },
    ],
  },
  {
    id: 'service-2-cash-withdrawal',
    serviceNumber: '2',
    serviceName: 'Cash Withdrawals from Payment Account',
    serviceDescription: 'Services enabling cash withdrawals from a payment account and all of the operations required for operating a payment account.',
    businessModelDescription: `The firm will allow customers to withdraw cash from their e-money accounts by:
- ATM withdrawals using co-branded prepaid MasterCard® – accepted at 95% of UK ATMs
- Cash-out at PayPoint & Post Office – customers scan an in-app barcode

On each withdrawal:
- Customer's e-money ledger is debited in real time
- Transaction receipt generated (in-app and optional SMS)
- Reconciliation engine processes daily settlement reports

Controls include velocity checks, geolocation checks, and multi-factor authentication.`,
    processFlow: {
      title: 'Cash Withdrawal Process Flow',
      description: 'Process of customer withdrawing cash via ATM or retail cash-out',
      steps: [
        { id: 'A', label: 'Customer requests withdrawal', description: 'Customer initiates withdrawal in app', type: 'start' },
        { id: 'B', label: 'Select channel', description: 'Choose ATM or retail cash-out', type: 'decision' },
        { id: 'C', label: 'Card authentication at ATM', description: 'Card authenticated with ATM network', type: 'process' },
        { id: 'D', label: 'Scan barcode at retailer', description: 'In-app barcode scanned at PayPoint/Post Office', type: 'process' },
        { id: 'E', label: 'ATM network authorises', description: 'ATM processes authorization', type: 'process' },
        { id: 'F', label: 'Retail POS authorises', description: 'POS authorizes via Paysafe', type: 'process' },
        { id: 'G', label: 'Debit ledger & bank', description: 'Push debit to ledger and principal bank', type: 'process' },
        { id: 'H', label: 'Cash dispensed', description: 'Physical cash given to customer', type: 'process' },
        { id: 'I', label: 'Receipt generated', description: 'In-app & SMS receipt sent', type: 'end' },
      ],
      connections: [
        { from: 'A', to: 'B' },
        { from: 'B', to: 'C', label: 'ATM' },
        { from: 'B', to: 'D', label: 'Retail' },
        { from: 'C', to: 'E' },
        { from: 'D', to: 'F' },
        { from: 'E', to: 'G' },
        { from: 'F', to: 'G' },
        { from: 'G', to: 'H' },
        { from: 'H', to: 'I' },
      ],
      mermaidCode: `flowchart TD
    A[Customer requests<br/>withdrawal in app] --> B{Select channel}
    B -->|ATM| C[Card authentication<br/>at ATM network]
    B -->|Retail cash-out| D[Scan in-app barcode<br/>at PayPoint/Post Office]
    C --> E[ATM network<br/>authorises]
    D --> F[Retail POS authorises<br/>via Paysafe]
    E --> G[Push debit request to<br/>ledger & principal bank]
    F --> G
    G --> H[Cash dispensed]
    H --> I[In-app & SMS<br/>receipt generated]

    style A fill:#3b82f6,color:#fff
    style B fill:#f59e0b,color:#000
    style I fill:#22c55e,color:#fff`,
    },
    fundsFlow: {
      title: 'Cash Withdrawal Funds Flow',
      description: 'Funds flow for customer accessing e-money via ATM or retail',
      steps: [
        { id: 'A', label: 'Customer', description: 'Initiates withdrawal', type: 'start' },
        { id: 'B', label: 'ATM Network', description: 'ATM withdrawal channel', type: 'external' },
        { id: 'C', label: 'Retailer/Agent', description: 'PayPoint, Post Office', type: 'external' },
        { id: 'D', label: 'Issuer Settlement Account', description: 'Settlement with distribution partners', type: 'process' },
        { id: 'E', label: 'e-Money Ledger & Vault', description: 'Customer balances and funds', type: 'process' },
      ],
      connections: [
        { from: 'A', to: 'B', label: 'Card/Barcode' },
        { from: 'A', to: 'C', label: 'Card/Barcode' },
        { from: 'B', to: 'D', label: 'Settlement instruction' },
        { from: 'C', to: 'D', label: 'Settlement instruction' },
        { from: 'D', to: 'E', label: 'Fund transfer (net of fee)' },
        { from: 'E', to: 'A', label: 'Ledger debit' },
      ],
      mermaidCode: `flowchart TD
    subgraph Client["Client Layer"]
        A[Customer]
    end

    subgraph Distribution["Distribution Layer"]
        B[ATM Network]
        C[Retailer/Agent<br/>PayPoint, Post Office]
    end

    subgraph Settlement["Settlement Layer"]
        D[Issuer Settlement<br/>Account]
    end

    subgraph Issuer["E-Money Issuer Layer"]
        E[e-Money Ledger<br/>& Vault]
    end

    A -->|Card/Barcode| B
    A -->|Card/Barcode| C
    B -->|Settlement instruction| D
    C -->|Settlement instruction| D
    D -->|Fund transfer<br/>net of fee| E
    E -->|Ledger debit| A

    style A fill:#3b82f6,color:#fff
    style E fill:#d4af37,color:#000`,
    },
    keyControls: [
      { area: 'ATM daily limit', control: '£200 (free) / £500 (max) with fees' },
      { area: 'Retail cash-out limit', control: '£300/txn, £1,000/day' },
      { area: 'Velocity checks', control: '3 withdrawals/hr cap' },
      { area: 'Authentication', control: 'PIN + device fingerprint + optional OTP' },
      { area: 'Reconciliation', control: 'Automated daily match; exceptions within 2 hrs' },
    ],
  },
  {
    id: 'service-4-payment-transactions',
    serviceNumber: '4',
    serviceName: 'Payment Transactions (Direct Debits, Card, Credit Transfers)',
    serviceDescription: 'Execution of payment transactions: direct debits (including one-off), payment card transactions, credit transfers (including standing orders).',
    businessModelDescription: `The firm will provide customers with the ability to execute:

Direct Debits – through Bacs Core and SEPA Core schemes. One-off and recurring mandates via secure web portal.

Card Payments – using co-branded prepaid MasterCard®; transactions authorised in real time via MasterCard network, settlement T+1.

Credit Transfers & Standing Orders – Faster Payments and SEPA Credit Transfers executed immediately; standing orders managed in-app.

All transactions feed into reconciliation engine with automated matching and exception reporting within 2 hours.`,
    processFlow: {
      title: 'Payment Transactions Process Flow',
      description: 'Process for various payment transactions through web/mobile app',
      steps: [
        { id: 'A', label: 'Customer', description: 'End-user initiating transactions', type: 'start' },
        { id: 'B', label: 'Web/Mobile App', description: 'Customer interface', type: 'process' },
        { id: 'C', label: 'Bacs/SEPA/Faster Payments', description: 'Bank transfer schemes', type: 'external' },
        { id: 'D', label: 'MasterCard Network', description: 'Card payment network', type: 'external' },
        { id: 'E', label: 'Reconciliation Engine', description: 'Transaction matching and verification', type: 'process' },
        { id: 'F', label: 'e-Money Ledger', description: 'Customer balance records', type: 'process' },
        { id: 'G', label: 'Settlement Bank Account', description: 'Funds settlement', type: 'process' },
      ],
      connections: [
        { from: 'A', to: 'B' },
        { from: 'B', to: 'C', label: 'Direct Debit / Credit Transfer' },
        { from: 'B', to: 'D', label: 'Card Transaction' },
        { from: 'C', to: 'E' },
        { from: 'D', to: 'E' },
        { from: 'E', to: 'F' },
        { from: 'E', to: 'G' },
        { from: 'F', to: 'A', label: 'Balance updated' },
      ],
      mermaidCode: `flowchart TD
    A[Customer] --> B[Web/Mobile App]
    B -->|Direct Debit mandate| C[Bacs / SEPA /<br/>Faster Payments]
    B -->|Credit Transfer/<br/>Standing Order| C
    B -->|Card Transaction| D[MasterCard®<br/>Network]
    C --> E[Reconciliation<br/>Engine]
    D --> E
    E --> F[e-Money Ledger]
    E --> G[Settlement<br/>Bank Account]
    F -->|Balance updated| A

    style A fill:#3b82f6,color:#fff
    style E fill:#8b5cf6,color:#fff
    style G fill:#d4af37,color:#000`,
    },
    fundsFlow: {
      title: 'Payment Transactions Funds Flow',
      description: 'Funds flow when customer makes payments from e-money account',
      steps: [
        { id: 'A', label: 'Customer e-Money Account', description: 'Source of payment', type: 'start' },
        { id: 'B', label: 'Bacs/Faster Payments/SEPA', description: 'Bank transfer schemes', type: 'external' },
        { id: 'C', label: 'Card Scheme Settlement', description: 'Card payment settlement', type: 'external' },
        { id: 'D', label: 'Principal Bank Account', description: 'Main operational account', type: 'process' },
        { id: 'E', label: 'e-Money Ledger & Vault', description: 'Balance management', type: 'process' },
      ],
      connections: [
        { from: 'A', to: 'B', label: 'Debit for payment' },
        { from: 'A', to: 'C', label: 'Debit for payment' },
        { from: 'B', to: 'D', label: 'Net settlement' },
        { from: 'C', to: 'D', label: 'Net settlement' },
        { from: 'D', to: 'E', label: 'Reconciliation & allocation' },
        { from: 'E', to: 'A', label: 'Account balance updated' },
      ],
      mermaidCode: `flowchart TD
    subgraph Customer["Customer Layer"]
        A[Customer<br/>e-Money Account]
    end

    subgraph Schemes["Payment Scheme Layer"]
        B[Bacs / Faster Payments<br/>/ SEPA]
        C[Card Scheme<br/>Settlement]
    end

    subgraph Issuer["E-Money Issuer Layer"]
        D[Principal<br/>Bank Account]
        E[e-Money Ledger<br/>& Vault]
    end

    A -->|Debit for payment| B
    A -->|Debit for payment| C
    B -->|Net settlement| D
    C -->|Net settlement| D
    D -->|Reconciliation<br/>& allocation| E
    E -->|Account balance<br/>updated| A

    style A fill:#3b82f6,color:#fff
    style D fill:#d4af37,color:#000`,
    },
    keyControls: [
      { area: 'Direct Debits', control: 'Bacs: T+1 (GBP); SEPA: T+1' },
      { area: 'Payment Card Transactions', control: 'Real time (auth); T+1 settlement' },
      { area: 'Credit Transfers', control: 'Instant (FPS); EOD (SEPA)' },
      { area: 'Standing Orders', control: 'Next-day processing; cut-off 23:00' },
    ],
  },
  {
    id: 'service-6-money-remittance',
    serviceNumber: '6',
    serviceName: 'Money Remittance',
    serviceDescription: 'Service where funds are received from a payer for the sole purpose of transferring a corresponding amount to a payee, without creating a payment account.',
    businessModelDescription: `The firm will offer money remittance services allowing customers to send funds from the UK to beneficiaries overseas without opening a payment account.

Funds may be sent via:
- Bank transfer to beneficiary's account
- Mobile wallet top-up (M-Pesa, MTN Mobile Money)
- Cash pick-up through partnered agents abroad

Partners with regulated payment institutions in destination markets. Funds remitted within 1-2 business days (often instantly for mobile wallets).

Full AML, fraud screening, and sanctions checks conducted before transmission.`,
    processFlow: {
      title: 'Money Remittance Process Flow',
      description: 'Process for international money transfer',
      steps: [
        { id: 'A', label: 'Customer initiates remittance', description: 'Transfer request submitted', type: 'start' },
        { id: 'B', label: 'Funds received by firm', description: 'Via bank/card/cash', type: 'process' },
        { id: 'C', label: 'Sanctions & AML screening', description: 'Compliance checks', type: 'process' },
        { id: 'D', label: 'Select Delivery Method', description: 'Choose payout channel', type: 'decision' },
        { id: 'E', label: 'Send via partner bank', description: 'Bank deposit to beneficiary', type: 'process' },
        { id: 'F', label: 'API push to mobile wallet', description: 'Mobile money transfer', type: 'process' },
        { id: 'G', label: 'Send to payout agent', description: 'Cash pickup instruction', type: 'process' },
        { id: 'H', label: 'Beneficiary receives funds', description: 'Successful delivery', type: 'process' },
        { id: 'I', label: 'Reconciliation & confirmation', description: 'Transaction verified', type: 'end' },
      ],
      connections: [
        { from: 'A', to: 'B' },
        { from: 'B', to: 'C' },
        { from: 'C', to: 'D' },
        { from: 'D', to: 'E', label: 'Bank Deposit' },
        { from: 'D', to: 'F', label: 'Mobile Wallet' },
        { from: 'D', to: 'G', label: 'Cash Pickup' },
        { from: 'E', to: 'H' },
        { from: 'F', to: 'H' },
        { from: 'G', to: 'H' },
        { from: 'H', to: 'I' },
      ],
      mermaidCode: `flowchart TD
    A[Customer initiates<br/>remittance] --> B[Funds received by firm<br/>bank/card/cash]
    B --> C[Sanctions & AML<br/>screening]
    C --> D{Delivery Method}
    D -->|Bank Deposit| E[Send via partner bank<br/>to beneficiary]
    D -->|Mobile Wallet| F[API push to<br/>mobile wallet provider]
    D -->|Cash Pickup| G[Send instruction to<br/>payout agent]
    E --> H[Beneficiary<br/>receives funds]
    F --> H
    G --> H
    H --> I[Reconciliation &<br/>confirmation]

    style A fill:#3b82f6,color:#fff
    style C fill:#ef4444,color:#fff
    style D fill:#f59e0b,color:#000
    style I fill:#22c55e,color:#fff`,
    },
    fundsFlow: {
      title: 'Money Remittance Funds Flow',
      description: 'Funds flow for international remittance including FX conversion',
      steps: [
        { id: 'A', label: 'Customer (Sender)', description: 'Initiates remittance', type: 'start' },
        { id: 'B', label: 'Client Bank Account', description: 'Receives sender payment', type: 'process' },
        { id: 'C', label: 'FX Conversion / Transfer', description: 'Currency exchange and instruction', type: 'process' },
        { id: 'D', label: 'Remittance Partner/Bank', description: 'Local payout partner', type: 'external' },
        { id: 'E', label: 'Beneficiary', description: 'Receives funds', type: 'end' },
      ],
      connections: [
        { from: 'A', to: 'B', label: 'Payment (GBP)' },
        { from: 'B', to: 'C' },
        { from: 'C', to: 'D', label: 'Payout' },
        { from: 'D', to: 'E', label: 'Local delivery' },
      ],
      mermaidCode: `flowchart TD
    subgraph Sender["Sender Side"]
        A[Customer<br/>Sender]
    end

    subgraph FYM["Firm Internal"]
        B[Client Bank<br/>Account]
        C[FX Conversion /<br/>Transfer Instruction]
    end

    subgraph Payout["Payout Layer"]
        D[Remittance Partner<br/>or Bank]
    end

    subgraph Beneficiary["Beneficiary Side"]
        E[Beneficiary]
    end

    A -->|Payment GBP| B
    B --> C
    C -->|Payout| D
    D -->|Local delivery| E

    style A fill:#3b82f6,color:#fff
    style C fill:#8b5cf6,color:#fff
    style E fill:#22c55e,color:#fff`,
    },
    keyControls: [
      { area: 'AML/CFT', control: 'Screening via ComplyAdvantage, Refinitiv, or Napier' },
      { area: 'Sanctions', control: 'Automated screening: OFAC, UN, EU, HMT lists' },
      { area: 'Geographic Limits', control: 'FATF-compliant jurisdictions only' },
      { area: 'Delivery Timeframes', control: 'Instant to 2 business days' },
      { area: 'Transaction Limits', control: '£500/txn, £3,000/month' },
      { area: 'Reconciliation', control: 'Daily reconciliation with partner confirmations' },
    ],
  },
  {
    id: 'service-6-remittance-ewallet',
    serviceNumber: '6',
    serviceName: 'Money Remittance from E-Wallet',
    serviceDescription: 'Transfer of funds by a sender who first loads money into a payment account (e-wallet) and then uses this account to remit funds to a beneficiary.',
    businessModelDescription: `The firm will offer e-wallet based remittance services. Users register and undergo KYC/AML checks. A payment account (e-wallet) is created, and customers load funds via:
- Debit/credit card
- Bank transfer (Faster Payments or SEPA)
- Physical vouchers (PayPoint)

Once funded, users can initiate transfers to named beneficiaries abroad using:
- Bank transfer to named account
- Mobile wallet transfer (M-Pesa, MTN)
- Cash pick-up at designated agents

Users can view balances, transaction histories, set recurring transfers, and receive notifications. Funds safeguarded until remittance completion.`,
    processFlow: {
      title: 'E-Wallet Remittance Process Flow',
      description: 'Process for customer loading e-wallet and initiating remittance',
      steps: [
        { id: 'A', label: 'Customer loads e-wallet', description: 'Adds funds to wallet', type: 'start' },
        { id: 'B', label: 'e-money account funded', description: 'Account created/funded', type: 'process' },
        { id: 'C', label: 'Customer initiates remittance', description: 'Transfer request', type: 'process' },
        { id: 'D', label: 'AML/sanctions screening', description: 'Compliance checks', type: 'process' },
        { id: 'E', label: 'Select payout method', description: 'Choose delivery channel', type: 'decision' },
        { id: 'F', label: 'Funds sent to bank', description: 'Bank transfer', type: 'process' },
        { id: 'G', label: 'Funds pushed to mobile', description: 'Mobile money', type: 'process' },
        { id: 'H', label: 'Cash pickup instruction', description: 'Agent payout', type: 'process' },
        { id: 'I', label: 'Beneficiary receives funds', description: 'Successful delivery', type: 'process' },
        { id: 'J', label: 'Reconciliation & reporting', description: 'Transaction completed', type: 'end' },
      ],
      connections: [
        { from: 'A', to: 'B' },
        { from: 'B', to: 'C' },
        { from: 'C', to: 'D' },
        { from: 'D', to: 'E' },
        { from: 'E', to: 'F', label: 'Bank transfer' },
        { from: 'E', to: 'G', label: 'Mobile money' },
        { from: 'E', to: 'H', label: 'Cash pick-up' },
        { from: 'F', to: 'I' },
        { from: 'G', to: 'I' },
        { from: 'H', to: 'I' },
        { from: 'I', to: 'J' },
      ],
      mermaidCode: `flowchart TD
    A[Customer loads<br/>e-wallet] --> B[e-money account<br/>created/funded]
    B --> C[Customer initiates<br/>remittance]
    C --> D[AML/sanctions<br/>screening]
    D --> E{Select payout<br/>method}
    E -->|Bank transfer| F[Funds sent to<br/>beneficiary account]
    E -->|Mobile money| G[Funds pushed to<br/>mobile wallet]
    E -->|Cash pick-up| H[Instruction sent to<br/>payout agent]
    F --> I[Beneficiary<br/>receives funds]
    G --> I
    H --> I
    I --> J[Reconciliation<br/>& reporting]

    style A fill:#3b82f6,color:#fff
    style D fill:#ef4444,color:#fff
    style E fill:#f59e0b,color:#000
    style J fill:#22c55e,color:#fff`,
    },
    fundsFlow: {
      title: 'E-Wallet Remittance Funds Flow',
      description: 'Funds flow for remittance initiated from customer e-wallet',
      steps: [
        { id: 'A', label: 'Customer e-wallet (GBP)', description: 'Source of remittance', type: 'start' },
        { id: 'B', label: 'Funds loaded', description: 'Card/FPS funding', type: 'process' },
        { id: 'C', label: 'Safeguarded Client Bank Account', description: 'Protected customer funds', type: 'process' },
        { id: 'D', label: 'E-wallet ledger', description: 'Balance tracking', type: 'process' },
        { id: 'E', label: 'Payout Partner / Bank', description: 'Local disbursement', type: 'external' },
        { id: 'F', label: 'Beneficiary', description: 'Receives funds', type: 'end' },
      ],
      connections: [
        { from: 'B', to: 'C' },
        { from: 'C', to: 'D' },
        { from: 'A', to: 'D', label: 'Remittance Instruction' },
        { from: 'D', to: 'E', label: 'Remittance Funds Transfer' },
        { from: 'E', to: 'F' },
      ],
      mermaidCode: `flowchart TD
    subgraph Sender["Sender Side"]
        A[Customer e-wallet<br/>GBP]
        B[Funds loaded<br/>card/FPS]
    end

    subgraph FYM["Firm Internal"]
        C[Safeguarded<br/>Client Bank Account]
        D[E-wallet ledger]
    end

    subgraph Payout["Payout Layer"]
        E[Payout Partner<br/>/ Bank]
    end

    subgraph Beneficiary["Beneficiary"]
        F[Beneficiary]
    end

    B --> C
    C --> D
    A -->|Remittance<br/>Instruction| D
    D -->|Remittance<br/>Funds Transfer| E
    E --> F

    style A fill:#3b82f6,color:#fff
    style C fill:#d4af37,color:#000
    style F fill:#22c55e,color:#fff`,
    },
    keyControls: [
      { area: 'KYC/Onboarding', control: 'ID verification, proof of address, risk scoring' },
      { area: 'AML/Sanctions', control: 'Automated screening at onboarding and per transaction' },
      { area: 'Transaction Limits', control: '£500/txn, £3,000/month (adjustable)' },
      { area: 'FX Controls', control: 'Mid-market rates + margin; disclosed before confirmation' },
      { area: 'Audit Trail', control: 'Full record of all activity (date, amount, beneficiary, FX rate)' },
      { area: 'Customer Access', control: 'Full control via mobile/web; real-time balance; in-app statements' },
    ],
  },
];

/**
 * Get unrelated payment by ID
 */
export function getUnrelatedPaymentById(id: string): UnrelatedPayment | undefined {
  return unrelatedPayments.find(p => p.id === id);
}

/**
 * Get all unrelated payments
 */
export function getAllUnrelatedPayments(): UnrelatedPayment[] {
  return unrelatedPayments;
}

/**
 * Convert natural language flow description to Mermaid code
 */
export function naturalLanguageToMermaid(
  description: string,
  flowType: 'process' | 'funds'
): string {
  // This is a simplified converter - in production, this would use AI
  const lines = description.split('\n').filter(line => line.trim());
  const nodes: string[] = [];
  const connections: string[] = [];

  let nodeId = 'A';
  const nodeMap = new Map<string, string>();

  lines.forEach((line, index) => {
    const cleanLine = line.replace(/^[\d]+\.\s*/, '').trim();
    if (cleanLine) {
      const currentId = String.fromCharCode(65 + index);
      nodes.push(`    ${currentId}[${cleanLine}]`);

      if (index > 0) {
        const prevId = String.fromCharCode(65 + index - 1);
        connections.push(`    ${prevId} --> ${currentId}`);
      }
    }
  });

  return `flowchart TD\n${nodes.join('\n')}\n${connections.join('\n')}`;
}

export default unrelatedPayments;
