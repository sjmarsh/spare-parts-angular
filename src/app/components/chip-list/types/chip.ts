interface Chip {
    id: string;
    name: string;
    isActive: boolean;
    color?: string | null;
    tooltip?: string | null;
}

export default Chip;