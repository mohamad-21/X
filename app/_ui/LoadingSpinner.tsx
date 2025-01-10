
function LoadingSpinner({ wrapperClassName, noPadding = false, className, color, size = 'default', type = 'default' }: { wrapperClassName?: string, className?: string, color?: string, size?: 'sm' | 'default', type?: 'default' | 'fullscreen' | 'fullheight', noPadding?: boolean }) {

  let spinnerSize = 'w-7 h-7';
  if (size === 'sm') spinnerSize = 'w-5 h-5';
  let spinnerType = `${(!noPadding && size !== 'sm') ? 'p-3' : ''} ${size === 'sm' ? '' : 'w-full'} ${type === 'fullheight' ? 'sm:min-h-[100dvh] min-h-[80dvh]' : 'min-h-full'} flex items-center justify-center`;
  if (type === 'fullscreen') spinnerType = 'fixed inset-0 flex p-3 w-full bg-background items-center justify-center';

  return (
    <div className={`${spinnerType} ${wrapperClassName || ''}`}>
      <div aria-label="Loading" className={`${spinnerSize} animate-spinner-linear-spin ${className || ''}`} >
        <svg height="100%" viewBox="0 0 32 32" width="100%"><circle cx="16" cy="16" fill="none" r="14" strokeWidth="4" style={{
          stroke: `${color || 'rgb(29, 155, 240)'}`,
          opacity: 0.2
        }}></circle><circle cx="16" cy="16" fill="none" r="14" strokeWidth="4" style={{
          stroke: `${color || 'rgb(29, 155, 240)'}`,
          strokeDasharray: 80,
          strokeDashoffset: 60
        }}></circle></svg>
      </div>
    </div>
  )
}

export default LoadingSpinner;
