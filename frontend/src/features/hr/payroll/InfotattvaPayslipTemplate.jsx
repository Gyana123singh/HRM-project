import React from 'react';

export const InfotattvaPayslipTemplate = ({ payslip }) => {
  if (!payslip) return null;

  // Formatting helpers
  const formatVal = (val) => {
    if (typeof val === 'number') {
      return val.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    }
    if (typeof val === 'string' && val.startsWith('₹')) {
      return val.replace('₹', '').trim();
    }
    return val || '0.00';
  };

  const empName = payslip.employeeName || (payslip.employeeId?.firstName ? `${payslip.employeeId.firstName} ${payslip.employeeId.lastName}` : 'Rahul Sharma');
  const empCode = payslip.employeeId?.employeeCode || payslip.employeeId || 'EMP-0001';
  const designation = payslip.designation || payslip.employeeId?.designation || 'Senior Software Engineer';
  const department = payslip.department || payslip.employeeId?.department?.name || payslip.employeeId?.department || 'Engineering';
  const joiningDate = payslip.joiningDate || (payslip.employeeId?.joiningDate ? new Date(payslip.employeeId.joiningDate).toLocaleDateString('en-IN') : '12/06/2023');
  const workLocation = payslip.workLocation || payslip.employeeId?.workLocation || 'Bhubaneswar';
  const panNumber = payslip.panNumber || payslip.employeeId?.panNumber || 'ABCDE1234F';
  const bankName = payslip.bankName || payslip.employeeId?.bankName || 'HDFC Bank';
  const accountNumber = payslip.accountNumber || payslip.employeeId?.accountNumber || 'XXXXX1234';
  const totalWorkingDays = payslip.totalWorkingDays !== undefined ? Number(payslip.totalWorkingDays).toFixed(1) : '30.0';
  const paidDays = payslip.paidDays !== undefined ? Number(payslip.paidDays).toFixed(1) : '30.0';
  const lopDays = payslip.lopDays !== undefined ? Number(payslip.lopDays).toFixed(1) : '0.0';

  const month = payslip.month || 'July 2026';
  const payDate = payslip.payDate || '28/07/2026';

  // Earnings Breakdown
  const basic = payslip.basicRaw || payslip.basic || 35000;
  const hra = payslip.hraRaw || payslip.hra || 14000;
  const conveyance = payslip.conveyanceRaw || payslip.conveyance || 3000;
  const specialAllowance = payslip.specialAllowanceRaw || payslip.specialAllowance || 5000;
  const bonus = payslip.bonusRaw || payslip.bonus || 2000;
  const otherEarnings = payslip.otherEarningsRaw || payslip.otherEarnings || 1000;

  const grossEarnings = payslip.grossRaw || (
    typeof basic === 'number'
      ? (basic + hra + conveyance + specialAllowance + bonus + otherEarnings)
      : 60000
  );

  const netSalary = payslip.netSalaryRaw || payslip.netSalary || grossEarnings;
  const amountInWords = payslip.amountInWords || 'Indian Rupees Sixty Thousand Only';
  const paymentMode = payslip.paymentMode || 'Bank Transfer';
  const transactionRef = payslip.transactionRef || 'TXN-982710492';

  return (
    <div
      id="infotattva-salary-slip"
      className="p-6 rounded-md w-full max-w-[760px] mx-auto font-sans text-[11px] leading-snug select-text box-border"
      style={{
        backgroundColor: '#ffffff',
        color: '#0f2942',
        border: '1px solid #c5d0dc',
        pageBreakInside: 'avoid'
      }}
    >
      {/* 1. Header Section */}
      <div className="flex flex-row justify-between items-center pb-4 mb-3 gap-4" style={{ borderBottom: '1px solid #e2e8f0' }}>
        {/* Left: Infotattva Logo SVG */}
        <div className="flex items-center gap-3">
          <svg width="150" height="75" viewBox="0 0 160 90" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="48" cy="38" r="26" fill="#1d5c96" />
            <ellipse cx="48" cy="38" rx="26" ry="11" stroke="#ffffff" strokeWidth="1.5" fill="none" opacity="0.6"/>
            <ellipse cx="48" cy="38" rx="13" ry="26" stroke="#ffffff" strokeWidth="1.5" fill="none" opacity="0.6"/>
            <line x1="48" y1="12" x2="48" y2="64" stroke="#ffffff" strokeWidth="1.5" opacity="0.6"/>
            <line x1="22" y1="38" x2="74" y2="38" stroke="#ffffff" strokeWidth="1.5" opacity="0.6"/>
            <path d="M 22 56 Q 44 42 62 20 L 58 16 L 78 14 L 74 34 L 68 28 Q 50 48 30 60 Z" fill="url(#arrowGrad)" />
            <defs>
              <linearGradient id="arrowGrad" x1="20" y1="60" x2="80" y2="15" gradientUnits="userSpaceOnUse">
                <stop offset="0%" stopColor="#f59e0b" />
                <stop offset="60%" stopColor="#fbbf24" />
                <stop offset="100%" stopColor="#ef4444" />
              </linearGradient>
            </defs>
            <text x="2" y="78" fontFamily="system-ui, sans-serif" fontWeight="900" fontSize="18" fill="#0f2942" letterSpacing="-0.5">
              Infotattva
            </text>
            <text x="2" y="86" fontFamily="system-ui, sans-serif" fontWeight="600" fontSize="5.5" fill="#475569" letterSpacing="0.2">
              Business Solutions (OPC) Private Limited
            </text>
          </svg>
        </div>

        {/* Right: Company Contact Details */}
        <div className="text-left max-w-lg">
          <h1 className="text-[13px] font-extrabold tracking-wide uppercase" style={{ color: '#0f2942' }}>
            INFOTATTVA BUSINESS SOLUTIONS (OPC) PRIVATE LIMITED
          </h1>
          <p className="text-[10px] mt-0.5" style={{ color: '#475569' }}>
            1010, 4th Floor, Sabarsahi Lane, Rasulgarh, Bhubaneswar - 751010
          </p>
          <p className="text-[9.5px]" style={{ color: '#64748b' }}>
            CIN: U62099OD2026OPC052146
          </p>
          <p className="text-[9.5px]" style={{ color: '#64748b' }}>
            contact@infotattvabusinesssolutions.com
          </p>
          <p className="text-[9.5px]" style={{ color: '#64748b' }}>
            www.infotattvabusinesssolutions.com
          </p>
        </div>
      </div>

      {/* 2. Title Bar */}
      <div
        className="my-3 px-4 py-2 flex flex-row justify-between items-center font-bold tracking-wide rounded-xs"
        style={{ backgroundColor: '#0f2942', color: '#ffffff' }}
      >
        <span className="text-[13px] font-extrabold uppercase tracking-wider">SALARY SLIP</span>
        <span className="text-[11px] font-normal">
          Salary Month: <span className="font-bold">{month}</span> &nbsp;|&nbsp; Pay Date: <span className="font-bold">{payDate}</span>
        </span>
      </div>

      {/* 3. Employee & Payroll Details */}
      <div className="mb-4">
        <h2 className="text-[10.5px] font-extrabold uppercase tracking-wider mb-1.5" style={{ color: '#0f2942' }}>
          EMPLOYEE & PAYROLL DETAILS
        </h2>
        <div className="overflow-hidden" style={{ border: '1px solid #c5d0dc' }}>
          <table className="w-full text-left text-[10.5px] border-collapse">
            <tbody>
              {/* Row 1 */}
              <tr style={{ borderBottom: '1px solid #c5d0dc' }}>
                <td className="w-1/4 px-3 py-1.5 font-bold" style={{ backgroundColor: '#f4f7fa', color: '#0f2942', width: '22%' }}>Employee Name</td>
                <td className="w-1/4 px-3 py-1.5 italic" style={{ color: '#334155', width: '28%', borderRight: '1px solid #c5d0dc' }}>{empName}</td>
                <td className="w-1/4 px-3 py-1.5 font-bold" style={{ backgroundColor: '#f4f7fa', color: '#0f2942', width: '22%' }}>Employee ID</td>
                <td className="w-1/4 px-3 py-1.5 italic" style={{ color: '#334155', width: '28%' }}>{empCode}</td>
              </tr>
              {/* Row 2 */}
              <tr style={{ borderBottom: '1px solid #c5d0dc' }}>
                <td className="px-3 py-1.5 font-bold" style={{ backgroundColor: '#f4f7fa', color: '#0f2942' }}>Designation</td>
                <td className="px-3 py-1.5 italic" style={{ color: '#334155', borderRight: '1px solid #c5d0dc' }}>{designation}</td>
                <td className="px-3 py-1.5 font-bold" style={{ backgroundColor: '#f4f7fa', color: '#0f2942' }}>Department</td>
                <td className="px-3 py-1.5 italic" style={{ color: '#334155' }}>{department}</td>
              </tr>
              {/* Row 3 */}
              <tr style={{ borderBottom: '1px solid #c5d0dc' }}>
                <td className="px-3 py-1.5 font-bold" style={{ backgroundColor: '#f4f7fa', color: '#0f2942' }}>Date of Joining</td>
                <td className="px-3 py-1.5 italic" style={{ color: '#334155', borderRight: '1px solid #c5d0dc' }}>{joiningDate}</td>
                <td className="px-3 py-1.5 font-bold" style={{ backgroundColor: '#f4f7fa', color: '#0f2942' }}>Work Location</td>
                <td className="px-3 py-1.5 italic" style={{ color: '#334155' }}>{workLocation}</td>
              </tr>
              {/* Row 4 */}
              <tr style={{ borderBottom: '1px solid #c5d0dc' }}>
                <td className="px-3 py-1.5 font-bold" style={{ backgroundColor: '#f4f7fa', color: '#0f2942' }}>PAN</td>
                <td className="px-3 py-1.5 italic font-mono" style={{ color: '#334155', borderRight: '1px solid #c5d0dc' }}>{panNumber}</td>
                <td className="px-3 py-1.5 font-bold" style={{ backgroundColor: '#f4f7fa', color: '#0f2942' }}>Total Working Days</td>
                <td className="px-3 py-1.5 italic" style={{ color: '#334155' }}>{totalWorkingDays}</td>
              </tr>
              {/* Row 5 */}
              <tr style={{ borderBottom: '1px solid #c5d0dc' }}>
                <td className="px-3 py-1.5 font-bold" style={{ backgroundColor: '#f4f7fa', color: '#0f2942' }}>Bank Name</td>
                <td className="px-3 py-1.5 italic" style={{ color: '#334155', borderRight: '1px solid #c5d0dc' }}>{bankName}</td>
                <td className="px-3 py-1.5 font-bold" style={{ backgroundColor: '#f4f7fa', color: '#0f2942' }}>Account Number</td>
                <td className="px-3 py-1.5 italic font-mono" style={{ color: '#334155' }}>{accountNumber}</td>
              </tr>
              {/* Row 6 */}
              <tr>
                <td className="px-3 py-1.5 font-bold" style={{ backgroundColor: '#f4f7fa', color: '#0f2942' }}>Paid Days</td>
                <td className="px-3 py-1.5 italic" style={{ color: '#334155', borderRight: '1px solid #c5d0dc' }}>{paidDays}</td>
                <td className="px-3 py-1.5 font-bold" style={{ backgroundColor: '#f4f7fa', color: '#0f2942' }}>LOP Days</td>
                <td className="px-3 py-1.5 italic" style={{ color: '#334155' }}>{lopDays}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* 4. Salary Breakdown */}
      <div className="mb-4">
        <h2 className="text-[10.5px] font-extrabold uppercase tracking-wider mb-1.5" style={{ color: '#0f2942' }}>
          SALARY BREAKDOWN
        </h2>
        <div className="overflow-hidden" style={{ border: '1px solid #c5d0dc' }}>
          <table className="w-full text-left text-[10.5px] border-collapse">
            <thead>
              <tr style={{ backgroundColor: '#0f2942', color: '#ffffff' }}>
                <th className="px-3 py-1.5 font-bold uppercase tracking-wider" style={{ borderRight: '1px solid #1e3a5f' }}>EARNINGS</th>
                <th className="px-3 py-1.5 font-bold uppercase tracking-wider text-right" style={{ width: '25%' }}>AMOUNT (₹)</th>
              </tr>
            </thead>
            <tbody>
              <tr style={{ borderBottom: '1px solid #e2e8f0' }}>
                <td className="px-3 py-1.5" style={{ color: '#1e293b', borderRight: '1px solid #c5d0dc' }}>Basic Salary</td>
                <td className="px-3 py-1.5 text-right italic font-mono" style={{ color: '#334155' }}>{formatVal(basic)}</td>
              </tr>
              <tr style={{ borderBottom: '1px solid #e2e8f0' }}>
                <td className="px-3 py-1.5" style={{ color: '#1e293b', borderRight: '1px solid #c5d0dc' }}>House Rent Allowance (HRA)</td>
                <td className="px-3 py-1.5 text-right italic font-mono" style={{ color: '#334155' }}>{formatVal(hra)}</td>
              </tr>
              <tr style={{ borderBottom: '1px solid #e2e8f0' }}>
                <td className="px-3 py-1.5" style={{ color: '#1e293b', borderRight: '1px solid #c5d0dc' }}>Conveyance / Travel Allowance</td>
                <td className="px-3 py-1.5 text-right italic font-mono" style={{ color: '#334155' }}>{formatVal(conveyance)}</td>
              </tr>
              <tr style={{ borderBottom: '1px solid #e2e8f0' }}>
                <td className="px-3 py-1.5" style={{ color: '#1e293b', borderRight: '1px solid #c5d0dc' }}>Special Allowance</td>
                <td className="px-3 py-1.5 text-right italic font-mono" style={{ color: '#334155' }}>{formatVal(specialAllowance)}</td>
              </tr>
              <tr style={{ borderBottom: '1px solid #e2e8f0' }}>
                <td className="px-3 py-1.5" style={{ color: '#1e293b', borderRight: '1px solid #c5d0dc' }}>Bonus / Incentive</td>
                <td className="px-3 py-1.5 text-right italic font-mono" style={{ color: '#334155' }}>{formatVal(bonus)}</td>
              </tr>
              <tr style={{ borderBottom: '1px solid #c5d0dc' }}>
                <td className="px-3 py-1.5" style={{ color: '#1e293b', borderRight: '1px solid #c5d0dc' }}>Other Earnings / Reimbursement</td>
                <td className="px-3 py-1.5 text-right italic font-mono" style={{ color: '#334155' }}>{formatVal(otherEarnings)}</td>
              </tr>
              {/* Gross Earnings Row */}
              <tr style={{ backgroundColor: '#e9f0f8', borderTop: '2px solid #a0b2c6' }}>
                <td className="px-3 py-2 font-extrabold uppercase" style={{ color: '#0f2942', borderRight: '1px solid #c5d0dc' }}>GROSS EARNINGS</td>
                <td className="px-3 py-2 text-right font-extrabold font-mono text-[11px]" style={{ color: '#0f2942' }}>{formatVal(grossEarnings)}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* 5. Net Salary Payable */}
      <div className="mb-4">
        <div
          className="flex flex-row justify-between items-center px-4 py-2.5 font-extrabold tracking-wide rounded-xs"
          style={{ backgroundColor: '#0f2942', color: '#ffffff' }}
        >
          <span className="text-[12px] uppercase">NET SALARY PAYABLE</span>
          <span className="text-[14px] font-bold font-mono">₹ {formatVal(netSalary)}</span>
        </div>

        <div
          className="overflow-hidden text-[10.5px]"
          style={{ border: '1px solid #c5d0dc', borderTop: 'none', backgroundColor: '#ffffff' }}
        >
          <table className="w-full text-left border-collapse">
            <tbody>
              <tr style={{ borderBottom: '1px solid #c5d0dc' }}>
                <td className="px-3 py-2 font-bold" style={{ backgroundColor: '#f4f7fa', color: '#0f2942', width: '22%' }}>Amount in Words</td>
                <td className="px-3 py-2 italic font-medium" style={{ color: '#1e293b' }}>{amountInWords}</td>
              </tr>
              <tr>
                <td className="px-3 py-2 font-bold" style={{ backgroundColor: '#f4f7fa', color: '#0f2942' }}>Payment Mode</td>
                <td className="px-3 py-2 italic" style={{ color: '#1e293b' }}>
                  {paymentMode} &nbsp;|&nbsp; Transaction Ref.: <span className="font-mono">{transactionRef}</span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* 6. Signatory Footer */}
      <div className="pt-4 mt-6 flex justify-end text-[10.5px]">
        <div className="text-right space-y-6">
          <p className="font-extrabold" style={{ color: '#0f2942' }}>
            For Infotattva Business Solutions (OPC) Private Limited
          </p>
          <div className="w-56 ml-auto" style={{ borderBottom: '1.5px solid #475569' }}></div>
          <div>
            <p className="font-extrabold text-[11px]" style={{ color: '#0f2942' }}>J. P. Tripathy</p>
            <p className="font-semibold" style={{ color: '#556070' }}>Director & Authorised Signatory</p>
          </div>
        </div>
      </div>
    </div>
  );
};
