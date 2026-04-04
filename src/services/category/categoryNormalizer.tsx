import {
	Briefcase,
	TrendingUp,
	Laptop,
	Home,
	Utensils,
	Bus,
	Wrench,
	HeartPulse,
	PartyPopper,
} from 'lucide-react'
import type { Category, CategoryType } from '@appTypes/category'

export interface CategoryRaw {
	uuid: string
	name: string
	category_type: string
	category_color: string
	category_icon: string
}

const COLOR_MAP: Record<string, string> = {
	green:     '#4CAF50',
	darkgreen: '#2E7D32',
	blue:      '#1976D2',
	orange:    '#F57C00',
	brown:     '#5D4037',
	gray:      '#616161',
	red:       '#C62828',
	purple:    '#6A1B9A',
}

const ICON_MAP: Record<string, React.ReactNode> = {
	briefcase:   <Briefcase size={18} />,
	trendingup:  <TrendingUp size={18} />,
	laptop:      <Laptop size={18} />,
	home:        <Home size={18} />,
	utensils:    <Utensils size={18} />,
	bus:         <Bus size={18} />,
	wrench:      <Wrench size={18} />,
	heartpulse:  <HeartPulse size={18} />,
	partypopper: <PartyPopper size={18} />,
}

export function normalizeCategory(raw: CategoryRaw): Category {
	return {
		uuid:  raw.uuid,
		name:  raw.name,
		type:  raw.category_type as CategoryType,
		color: COLOR_MAP[raw.category_color] ?? raw.category_color,
		icon:  ICON_MAP[raw.category_icon] ?? null,
	}
}
