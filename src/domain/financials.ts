/**
 * المعادلات المالية الصارمة وخوارزمية التفقيط باللغة العربية لنظام كهرباني
 */

// جدول الكلمات للتفقيط العربي
const ONES = ['', 'واحد', 'اثنان', 'ثلاثة', 'أربعة', 'خمسة', 'ستة', 'سبعة', 'ثمانية', 'تسعة'];
const ONES_FEMININE = ['', 'واحدة', 'اثنتان', 'ثلاث', 'أربع', 'خمس', 'ست', 'سبع', 'ثمان', 'تسع'];
const TEENS = [
  'عشرة',
  'أحد عشر',
  'اثنا عشر',
  'ثلاثة عشر',
  'أربعة عشر',
  'خمسة عشر',
  'ستة عشر',
  'سبعة عشر',
  'ثمانية عشر',
  'تسعة عشر'
];
const TENS = ['', 'عشرة', 'عشرون', 'ثلاثون', 'أربعون', 'خمسون', 'ستون', 'سبعون', 'ثمانون', 'تسعون'];
const HUNDREDS = [
  '',
  'مائة',
  'مئتان',
  'ثلاثمائة',
  'أربعمائة',
  'خمسمائة',
  'ستمائة',
  'سبعمائة',
  'ثمانمائة',
  'تسعمائة'
];

function convertGroup(n: number): string {
  let output = '';
  const h = Math.floor(n / 100);
  const rem = n % 100;
  const t = Math.floor(rem / 10);
  const o = rem % 10;

  if (h > 0) {
    output += HUNDREDS[h];
  }

  if (rem > 0) {
    if (output.length > 0) output += ' و';
    if (rem >= 10 && rem < 20) {
      output += TEENS[rem - 10];
    } else {
      if (o > 0) {
        output += ONES[o];
        if (t > 0) output += ' و' + TENS[t];
      } else if (t > 0) {
        output += TENS[t];
      }
    }
  }

  return output;
}

/**
 * تحويل الأرقام إلى نص باللغة العربية (تفقيط) مع العملة الافتراضية (ريال يمني)
 * مثال: 350000 -> ثلاثمائة وخمسون ألف ريال يمني فقط لا غير
 */
export function tafqeetArabic(num: number, currency: string = 'ريال يمني'): string {
  if (num === 0) return `صفر ${currency} فقط لا غير`;
  if (isNaN(num)) return '';

  const isNegative = num < 0;
  num = Math.abs(Math.round(num));

  let result = '';

  const billions = Math.floor(num / 1000000000);
  num %= 1000000000;
  const millions = Math.floor(num / 1000000);
  num %= 1000000;
  const thousands = Math.floor(num / 1000);
  const remainder = num % 1000;

  if (billions > 0) {
    if (billions === 1) result += 'مليار';
    else if (billions === 2) result += 'ملياران';
    else if (billions >= 3 && billions <= 10) result += convertGroup(billions) + ' مليارات';
    else result += convertGroup(billions) + ' مليار';
  }

  if (millions > 0) {
    if (result.length > 0) result += ' و';
    if (millions === 1) result += 'مليون';
    else if (millions === 2) result += 'مليونان';
    else if (millions >= 3 && millions <= 10) result += convertGroup(millions) + ' ملايين';
    else result += convertGroup(millions) + ' مليون';
  }

  if (thousands > 0) {
    if (result.length > 0) result += ' و';
    if (thousands === 1) result += 'ألف';
    else if (thousands === 2) result += 'ألفان';
    else if (thousands >= 3 && thousands <= 10) result += convertGroup(thousands) + ' آلاف';
    else result += convertGroup(thousands) + ' ألف';
  }

  if (remainder > 0) {
    if (result.length > 0) result += ' و';
    result += convertGroup(remainder);
  }

  const prefix = isNegative ? 'سالب ' : '';
  return `${prefix}${result} ${currency} فقط لا غير`;
}

/**
 * تنسيق المبالغ المالية مع العملة أو إخفائها عند تفعيل وضع الخصوصية
 */
export function formatMoney(amount: number, hideFinancialAmounts: boolean = false, symbol: string = 'ر.ي'): string {
  if (hideFinancialAmounts) {
    return '••••••';
  }
  const rounded = Math.round(amount);
  return `${rounded.toLocaleString('en-US')} ${symbol}`;
}

/**
 * حساب أجر اليوم وفق نسبة العمل
 */
export function calculateDailyWage(dailyWage: number, ratio: number): number {
  return Math.round(dailyWage * ratio);
}

/**
 * احتساب ربحية المشروع:
 * الإيرادات (المقبوضات أو الفواتير)
 * - تكلفة العمال
 * - المصروفات
 * = صافي الربح
 * وهامش الربح
 */
export interface ProjectProfitabilityResult {
  totalRevenue: number;
  laborCost: number;
  expensesCost: number;
  totalCost: number;
  netProfit: number;
  profitMarginPercent: number;
}

export function calculateProjectProfit(
  revenue: number,
  laborCost: number,
  expensesCost: number
): ProjectProfitabilityResult {
  const totalCost = laborCost + expensesCost;
  const netProfit = revenue - totalCost;
  const profitMarginPercent = revenue > 0 ? Math.round((netProfit / revenue) * 100) : 0;

  return {
    totalRevenue: revenue,
    laborCost,
    expensesCost,
    totalCost,
    netProfit,
    profitMarginPercent
  };
}
