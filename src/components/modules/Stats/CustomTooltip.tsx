/* eslint-disable @typescript-eslint/no-explicit-any */
interface CustomTooltipProps {
  active?: boolean;
  payload?: any[];
  label?: string;
}

const CustomTooltip = ({ active, payload, label }: CustomTooltipProps) => {
  if (!active || !payload?.length) return null;

  return (
    <div className='rounded-lg border bg-background/40 text-foreground p-3 shadow-md text-xs'>
      <p className='font-semibold mb-2'>{label}</p>

      {payload.map((entry, index) => (
        <p key={index} style={{ color: entry.color }}>
          {entry.name}: {entry.value.toLocaleString()}
        </p>
      ))}
    </div>
  );
};

export default CustomTooltip;
