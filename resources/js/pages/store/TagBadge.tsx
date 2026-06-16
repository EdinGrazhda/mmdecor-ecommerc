interface TagBadgeProps {
    tag: string;
}

export function TagBadge({ tag }: TagBadgeProps) {
    const styles: Record<string, string> = {
        SALE: 'bg-red-500 text-white ring-1 ring-red-400/50',
        BESTSELLER: 'bg-[#2E6F8F] text-white ring-1 ring-[#2E6F8F]/50',
        NEW: 'bg-[#0D2535] text-white ring-1 ring-white/20',
    };
    return (
        <span
            className={`${styles[tag] ?? 'bg-gray-200 text-gray-700'} rounded px-2 py-0.5 text-[10px] font-black tracking-widest uppercase shadow-sm`}
        >
            {tag}
        </span>
    );
}
