export default function ConstraintRow({ label, current, requirement, met }: {
    label: string;
    current: number;
    requirement: string;
    met: boolean;
}) {
    return (
        <div className="flex justify-between">
            <span className="text-content-muted">{label}</span>
            <span className={met ? 'text-success-500' : 'text-error-500'}>
                {current} / {requirement}
            </span>
        </div>
    );
}
