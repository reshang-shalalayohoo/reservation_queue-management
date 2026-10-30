/**
 * Viking Grill — Empty State SVG Illustrations
 * Minimalist, elegant vector illustrations using dark red, white, and charcoal.
 */

// Color constants matching Viking Grill theme
const C = {
  red: '#8B1A1A',
  redLight: '#A52A2A',
  redDark: '#6B1010',
  redGlow: 'rgba(139, 26, 26, 0.2)',
  white: '#FFFFFF',
  whiteMuted: 'rgba(255,255,255,0.6)',
  charcoal: '#2a2a2a',
  charcoalLight: '#333333',
  charcoalDark: '#1a1a1a',
};

export function CalendarIllustration() {
  return (
    <svg viewBox="0 0 140 140" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Calendar body */}
      <rect x="25" y="35" width="90" height="80" rx="8" fill={C.charcoal} stroke={C.charcoalLight} strokeWidth="1.5" />
      {/* Calendar header */}
      <rect x="25" y="35" width="90" height="22" rx="8" fill={C.red} />
      <rect x="25" y="49" width="90" height="8" fill={C.red} />
      {/* Calendar hooks */}
      <rect x="47" y="28" width="4" height="14" rx="2" fill={C.whiteMuted} />
      <rect x="89" y="28" width="4" height="14" rx="2" fill={C.whiteMuted} />
      {/* Calendar grid dots */}
      <circle cx="46" cy="74" r="3.5" fill={C.charcoalLight} />
      <circle cx="62" cy="74" r="3.5" fill={C.charcoalLight} />
      <circle cx="78" cy="74" r="3.5" fill={C.charcoalLight} />
      <circle cx="94" cy="74" r="3.5" fill={C.charcoalLight} />
      <circle cx="46" cy="92" r="3.5" fill={C.charcoalLight} />
      <circle cx="62" cy="92" r="3.5" fill={C.charcoalLight} />
      <circle cx="78" cy="92" r="3.5" fill={C.charcoalLight} />
      <circle cx="94" cy="92" r="3.5" fill={C.charcoalLight} />
      {/* Accent mark */}
      <circle cx="78" cy="74" r="3.5" fill={C.red} opacity="0.5" />
    </svg>
  );
}

export function WaitingChairsIllustration() {
  return (
    <svg viewBox="0 0 140 140" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Chair 1 */}
      <rect x="20" y="55" width="28" height="24" rx="4" fill={C.charcoal} stroke={C.charcoalLight} strokeWidth="1.5" />
      <rect x="22" y="42" width="24" height="16" rx="4" fill={C.charcoal} stroke={C.charcoalLight} strokeWidth="1.5" />
      <rect x="24" y="79" width="4" height="18" rx="2" fill={C.charcoalLight} />
      <rect x="40" y="79" width="4" height="18" rx="2" fill={C.charcoalLight} />
      {/* Chair 2 */}
      <rect x="56" y="55" width="28" height="24" rx="4" fill={C.charcoal} stroke={C.charcoalLight} strokeWidth="1.5" />
      <rect x="58" y="42" width="24" height="16" rx="4" fill={C.charcoal} stroke={C.charcoalLight} strokeWidth="1.5" />
      <rect x="60" y="79" width="4" height="18" rx="2" fill={C.charcoalLight} />
      <rect x="76" y="79" width="4" height="18" rx="2" fill={C.charcoalLight} />
      {/* Chair 3 */}
      <rect x="92" y="55" width="28" height="24" rx="4" fill={C.charcoal} stroke={C.charcoalLight} strokeWidth="1.5" />
      <rect x="94" y="42" width="24" height="16" rx="4" fill={C.charcoal} stroke={C.charcoalLight} strokeWidth="1.5" />
      <rect x="96" y="79" width="4" height="18" rx="2" fill={C.charcoalLight} />
      <rect x="112" y="79" width="4" height="18" rx="2" fill={C.charcoalLight} />
      {/* Floor line */}
      <line x1="15" y1="100" x2="125" y2="100" stroke={C.charcoalLight} strokeWidth="1.5" strokeLinecap="round" />
      {/* Clock above */}
      <circle cx="70" cy="25" r="10" fill="none" stroke={C.red} strokeWidth="1.5" />
      <line x1="70" y1="25" x2="70" y2="19" stroke={C.red} strokeWidth="1.5" strokeLinecap="round" />
      <line x1="70" y1="25" x2="75" y2="25" stroke={C.red} strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

export function RestaurantTableIllustration() {
  return (
    <svg viewBox="0 0 140 140" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Table top */}
      <ellipse cx="70" cy="65" rx="48" ry="14" fill={C.charcoal} stroke={C.charcoalLight} strokeWidth="1.5" />
      {/* Table legs */}
      <rect x="38" y="72" width="5" height="30" rx="2" fill={C.charcoalLight} transform="rotate(-5 38 72)" />
      <rect x="97" y="72" width="5" height="30" rx="2" fill={C.charcoalLight} transform="rotate(5 97 72)" />
      {/* Plate */}
      <ellipse cx="56" cy="60" rx="11" ry="4" fill="none" stroke={C.whiteMuted} strokeWidth="1" />
      {/* Glass */}
      <rect x="78" y="52" width="6" height="10" rx="2" fill="none" stroke={C.whiteMuted} strokeWidth="1" />
      <rect x="79.5" y="62" width="3" height="5" rx="1" fill={C.whiteMuted} opacity="0.5" />
      {/* Chair left */}
      <rect x="15" y="75" width="18" height="4" rx="2" fill={C.red} opacity="0.6" />
      <rect x="15" y="63" width="18" height="14" rx="3" fill="none" stroke={C.red} strokeWidth="1.2" opacity="0.5" />
      {/* Chair right */}
      <rect x="107" y="75" width="18" height="4" rx="2" fill={C.red} opacity="0.6" />
      <rect x="107" y="63" width="18" height="14" rx="3" fill="none" stroke={C.red} strokeWidth="1.2" opacity="0.5" />
      {/* Floor */}
      <line x1="10" y1="108" x2="130" y2="108" stroke={C.charcoalLight} strokeWidth="1" strokeLinecap="round" />
    </svg>
  );
}

export function FoodTrayIllustration() {
  return (
    <svg viewBox="0 0 140 140" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Dome / cloche */}
      <path d="M35 80 C35 45, 105 45, 105 80" fill="none" stroke={C.whiteMuted} strokeWidth="2" strokeLinecap="round" />
      {/* Dome handle */}
      <circle cx="70" cy="44" r="4" fill="none" stroke={C.red} strokeWidth="1.5" />
      {/* Tray base */}
      <rect x="28" y="78" width="84" height="6" rx="3" fill={C.charcoal} stroke={C.charcoalLight} strokeWidth="1.5" />
      {/* Tray pedestal */}
      <rect x="54" y="84" width="32" height="5" rx="2" fill={C.charcoalLight} />
      <rect x="48" y="89" width="44" height="4" rx="2" fill={C.charcoal} stroke={C.charcoalLight} strokeWidth="1" />
      {/* Steam lines */}
      <path d="M55 38 Q57 32, 55 26" fill="none" stroke={C.red} strokeWidth="1.2" strokeLinecap="round" opacity="0.5" />
      <path d="M70 34 Q72 28, 70 22" fill="none" stroke={C.red} strokeWidth="1.2" strokeLinecap="round" opacity="0.5" />
      <path d="M85 38 Q87 32, 85 26" fill="none" stroke={C.red} strokeWidth="1.2" strokeLinecap="round" opacity="0.5" />
    </svg>
  );
}

export function ShoppingCartIllustration() {
  return (
    <svg viewBox="0 0 140 140" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Cart body */}
      <path d="M35 45 L45 45 L55 85 L105 85 L112 55 L50 55" fill="none" stroke={C.whiteMuted} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      {/* Cart handle */}
      <line x1="25" y1="45" x2="35" y2="45" stroke={C.whiteMuted} strokeWidth="2" strokeLinecap="round" />
      {/* Wheels */}
      <circle cx="62" cy="95" r="6" fill="none" stroke={C.red} strokeWidth="2" />
      <circle cx="62" cy="95" r="2" fill={C.red} />
      <circle cx="98" cy="95" r="6" fill="none" stroke={C.red} strokeWidth="2" />
      <circle cx="98" cy="95" r="2" fill={C.red} />
      {/* Dashed lines inside (empty) */}
      <line x1="58" y1="65" x2="100" y2="65" stroke={C.charcoalLight} strokeWidth="1" strokeDasharray="4 3" />
      <line x1="56" y1="75" x2="103" y2="75" stroke={C.charcoalLight} strokeWidth="1" strokeDasharray="4 3" />
    </svg>
  );
}

export function ReceiptIllustration() {
  return (
    <svg viewBox="0 0 140 140" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Receipt paper */}
      <path d="M40 20 L40 110 L45 105 L50 110 L55 105 L60 110 L65 105 L70 110 L75 105 L80 110 L85 105 L90 110 L95 105 L100 110 L100 20 Z" fill={C.charcoal} stroke={C.charcoalLight} strokeWidth="1.5" />
      {/* Lines */}
      <line x1="50" y1="38" x2="90" y2="38" stroke={C.charcoalLight} strokeWidth="2" strokeLinecap="round" />
      <line x1="50" y1="50" x2="82" y2="50" stroke={C.charcoalLight} strokeWidth="1.5" strokeLinecap="round" />
      <line x1="50" y1="60" x2="88" y2="60" stroke={C.charcoalLight} strokeWidth="1.5" strokeLinecap="round" />
      <line x1="50" y1="70" x2="78" y2="70" stroke={C.charcoalLight} strokeWidth="1.5" strokeLinecap="round" />
      {/* Total line */}
      <line x1="50" y1="85" x2="90" y2="85" stroke={C.red} strokeWidth="1.5" strokeLinecap="round" opacity="0.6" />
      {/* Circle accent */}
      <circle cx="55" cy="38" r="2" fill={C.red} opacity="0.5" />
    </svg>
  );
}

export function OrderBoardIllustration() {
  return (
    <svg viewBox="0 0 140 140" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Board */}
      <rect x="25" y="25" width="90" height="90" rx="6" fill={C.charcoal} stroke={C.charcoalLight} strokeWidth="1.5" />
      {/* Top bar */}
      <rect x="25" y="25" width="90" height="16" rx="6" fill={C.red} opacity="0.8" />
      <rect x="25" y="35" width="90" height="6" fill={C.red} opacity="0.8" />
      {/* Ticket slots */}
      <rect x="35" y="50" width="30" height="22" rx="3" fill={C.charcoalLight} />
      <rect x="75" y="50" width="30" height="22" rx="3" fill={C.charcoalLight} />
      <rect x="35" y="80" width="30" height="22" rx="3" fill={C.charcoalLight} />
      <rect x="75" y="80" width="30" height="22" rx="3" fill={C.charcoalLight} />
      {/* Ticket lines */}
      <line x1="40" y1="58" x2="58" y2="58" stroke={C.charcoalDark} strokeWidth="1.5" strokeLinecap="round" />
      <line x1="40" y1="64" x2="54" y2="64" stroke={C.charcoalDark} strokeWidth="1" strokeLinecap="round" />
    </svg>
  );
}

export function QueueIllustration() {
  return (
    <svg viewBox="0 0 140 140" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Ticket */}
      <rect x="35" y="30" width="70" height="80" rx="6" fill={C.charcoal} stroke={C.charcoalLight} strokeWidth="1.5" />
      {/* Perforated line */}
      <line x1="35" y1="75" x2="105" y2="75" stroke={C.charcoalLight} strokeWidth="1" strokeDasharray="4 3" />
      {/* Number */}
      <text x="70" y="62" textAnchor="middle" fill={C.red} fontFamily="Cinzel, Georgia, serif" fontSize="24" fontWeight="700" opacity="0.7">—</text>
      {/* Top label line */}
      <line x1="50" y1="42" x2="90" y2="42" stroke={C.charcoalLight} strokeWidth="2" strokeLinecap="round" />
      {/* Bottom info */}
      <line x1="48" y1="86" x2="72" y2="86" stroke={C.charcoalLight} strokeWidth="1.5" strokeLinecap="round" />
      <line x1="48" y1="94" x2="66" y2="94" stroke={C.charcoalLight} strokeWidth="1" strokeLinecap="round" />
      {/* Accent dot */}
      <circle cx="88" cy="86" r="4" fill={C.red} opacity="0.4" />
    </svg>
  );
}

export function SeatingIllustration() {
  return (
    <svg viewBox="0 0 140 140" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Round table */}
      <ellipse cx="70" cy="70" rx="30" ry="12" fill={C.charcoal} stroke={C.charcoalLight} strokeWidth="1.5" />
      {/* Table leg */}
      <rect x="67" y="78" width="6" height="20" rx="2" fill={C.charcoalLight} />
      <ellipse cx="70" cy="100" rx="14" ry="4" fill={C.charcoalLight} opacity="0.5" />
      {/* Chairs around (circles) */}
      <circle cx="70" cy="42" r="8" fill="none" stroke={C.red} strokeWidth="1.5" opacity="0.5" />
      <circle cx="35" cy="70" r="8" fill="none" stroke={C.red} strokeWidth="1.5" opacity="0.5" />
      <circle cx="105" cy="70" r="8" fill="none" stroke={C.red} strokeWidth="1.5" opacity="0.5" />
      {/* Place settings */}
      <circle cx="58" cy="66" r="3" fill="none" stroke={C.whiteMuted} strokeWidth="0.8" />
      <circle cx="82" cy="66" r="3" fill="none" stroke={C.whiteMuted} strokeWidth="0.8" />
    </svg>
  );
}

export function DashboardIllustration() {
  return (
    <svg viewBox="0 0 140 140" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Card 1 */}
      <rect x="15" y="25" width="50" height="35" rx="5" fill={C.charcoal} stroke={C.charcoalLight} strokeWidth="1.5" />
      <line x1="25" y1="37" x2="45" y2="37" stroke={C.charcoalLight} strokeWidth="2" strokeLinecap="round" />
      <line x1="25" y1="47" x2="55" y2="47" stroke={C.red} strokeWidth="2" strokeLinecap="round" opacity="0.5" />
      {/* Card 2 */}
      <rect x="75" y="25" width="50" height="35" rx="5" fill={C.charcoal} stroke={C.charcoalLight} strokeWidth="1.5" />
      <line x1="85" y1="37" x2="105" y2="37" stroke={C.charcoalLight} strokeWidth="2" strokeLinecap="round" />
      <line x1="85" y1="47" x2="115" y2="47" stroke={C.red} strokeWidth="2" strokeLinecap="round" opacity="0.5" />
      {/* Chart area */}
      <rect x="15" y="70" width="110" height="50" rx="5" fill={C.charcoal} stroke={C.charcoalLight} strokeWidth="1.5" />
      {/* Bar chart */}
      <rect x="30" y="95" width="10" height="15" rx="2" fill={C.charcoalLight} />
      <rect x="48" y="88" width="10" height="22" rx="2" fill={C.red} opacity="0.5" />
      <rect x="66" y="92" width="10" height="18" rx="2" fill={C.charcoalLight} />
      <rect x="84" y="82" width="10" height="28" rx="2" fill={C.red} opacity="0.5" />
      <rect x="102" y="90" width="10" height="20" rx="2" fill={C.charcoalLight} />
    </svg>
  );
}

export function NotFoundIllustration() {
  return (
    <svg viewBox="0 0 140 140" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Document */}
      <rect x="35" y="20" width="70" height="90" rx="6" fill={C.charcoal} stroke={C.charcoalLight} strokeWidth="1.5" />
      {/* Document corner fold */}
      <path d="M85 20 L105 20 L105 40 Z" fill={C.charcoalLight} opacity="0.5" />
      {/* Search circle */}
      <circle cx="65" cy="62" r="18" fill="none" stroke={C.red} strokeWidth="2" opacity="0.6" />
      {/* Search handle */}
      <line x1="78" y1="75" x2="90" y2="87" stroke={C.red} strokeWidth="2.5" strokeLinecap="round" opacity="0.6" />
      {/* Question mark */}
      <text x="65" y="68" textAnchor="middle" fill={C.whiteMuted} fontSize="18" fontWeight="600">?</text>
    </svg>
  );
}

export function SearchIllustration() {
  return (
    <svg viewBox="0 0 140 140" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Magnifying glass */}
      <circle cx="60" cy="58" r="25" fill="none" stroke={C.whiteMuted} strokeWidth="2" />
      <line x1="78" y1="76" x2="100" y2="98" stroke={C.whiteMuted} strokeWidth="3" strokeLinecap="round" />
      {/* Filter lines inside */}
      <line x1="47" y1="52" x2="73" y2="52" stroke={C.charcoalLight} strokeWidth="1.5" strokeLinecap="round" />
      <line x1="50" y1="60" x2="70" y2="60" stroke={C.charcoalLight} strokeWidth="1.5" strokeLinecap="round" />
      <line x1="47" y1="68" x2="73" y2="68" stroke={C.charcoalLight} strokeWidth="1.5" strokeLinecap="round" />
      {/* X mark */}
      <line x1="55" y1="55" x2="65" y2="65" stroke={C.red} strokeWidth="2" strokeLinecap="round" opacity="0.5" />
      <line x1="65" y1="55" x2="55" y2="65" stroke={C.red} strokeWidth="2" strokeLinecap="round" opacity="0.5" />
    </svg>
  );
}

export function MenuItemIllustration() {
  return (
    <svg viewBox="0 0 140 140" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Plate */}
      <ellipse cx="70" cy="80" rx="40" ry="16" fill="none" stroke={C.whiteMuted} strokeWidth="1.5" />
      <ellipse cx="70" cy="80" rx="28" ry="10" fill="none" stroke={C.charcoalLight} strokeWidth="1" />
      {/* Fork */}
      <line x1="30" y1="35" x2="30" y2="75" stroke={C.whiteMuted} strokeWidth="1.5" strokeLinecap="round" />
      <line x1="26" y1="35" x2="26" y2="50" stroke={C.whiteMuted} strokeWidth="1" strokeLinecap="round" />
      <line x1="30" y1="35" x2="30" y2="50" stroke={C.whiteMuted} strokeWidth="1" strokeLinecap="round" />
      <line x1="34" y1="35" x2="34" y2="50" stroke={C.whiteMuted} strokeWidth="1" strokeLinecap="round" />
      {/* Knife */}
      <line x1="110" y1="35" x2="110" y2="75" stroke={C.whiteMuted} strokeWidth="1.5" strokeLinecap="round" />
      <path d="M110 35 Q115 45 110 55" fill="none" stroke={C.whiteMuted} strokeWidth="1" />
      {/* Question on plate */}
      <text x="70" y="84" textAnchor="middle" fill={C.red} fontSize="14" fontWeight="600" opacity="0.5">?</text>
    </svg>
  );
}

export function OrderStatusIllustration() {
  return (
    <svg viewBox="0 0 140 140" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Receipt / ticket */}
      <rect x="35" y="20" width="70" height="100" rx="6" fill={C.charcoal} stroke={C.charcoalLight} strokeWidth="1.5" />
      {/* Top header */}
      <rect x="35" y="20" width="70" height="18" rx="6" fill={C.red} opacity="0.5" />
      <rect x="35" y="32" width="70" height="6" fill={C.red} opacity="0.5" />
      {/* Content lines */}
      <line x1="45" y1="50" x2="75" y2="50" stroke={C.charcoalLight} strokeWidth="1.5" strokeLinecap="round" />
      <line x1="45" y1="60" x2="95" y2="60" stroke={C.charcoalLight} strokeWidth="1.5" strokeLinecap="round" />
      <line x1="45" y1="70" x2="85" y2="70" stroke={C.charcoalLight} strokeWidth="1.5" strokeLinecap="round" />
      {/* Progress dots */}
      <circle cx="52" cy="90" r="4" fill={C.charcoalLight} />
      <line x1="56" y1="90" x2="64" y2="90" stroke={C.charcoalLight} strokeWidth="1.5" />
      <circle cx="70" cy="90" r="4" fill={C.charcoalLight} />
      <line x1="74" y1="90" x2="82" y2="90" stroke={C.charcoalLight} strokeWidth="1.5" />
      <circle cx="88" cy="90" r="4" fill={C.charcoalLight} />
    </svg>
  );
}

// Export a mapping for easy reference
const illustrations = {
  calendar: CalendarIllustration,
  waitingChairs: WaitingChairsIllustration,
  restaurantTable: RestaurantTableIllustration,
  foodTray: FoodTrayIllustration,
  shoppingCart: ShoppingCartIllustration,
  receipt: ReceiptIllustration,
  orderBoard: OrderBoardIllustration,
  queue: QueueIllustration,
  seating: SeatingIllustration,
  dashboard: DashboardIllustration,
  notFound: NotFoundIllustration,
  search: SearchIllustration,
  menuItem: MenuItemIllustration,
  orderStatus: OrderStatusIllustration,
};

export default illustrations;

