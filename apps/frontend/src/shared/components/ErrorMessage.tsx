import './ErrorMessage.css';

interface ErrorMessageProps {
  title?: string;
  message: string;
  details?: string[];
  onRetry?: () => void;
  showIcon?: boolean;
}

export function ErrorMessage({
  title = 'Error',
  message,
  details,
  onRetry,
  showIcon = true,
}: ErrorMessageProps) {
  return (
    <div className="error-message">
      {showIcon && <div className="error-message-icon">!</div>}
      <h3 className="error-message-title">{title}</h3>
      <p className="error-message-text">{message}</p>
      {details && details.length > 0 && (
        <ul className="error-message-details">
          {details.map((detail, index) => (
            <li key={index} className="error-message-detail">
              {detail}
            </li>
          ))}
        </ul>
      )}
      {onRetry && (
        <button className="error-message-retry" onClick={onRetry}>
          Try Again
        </button>
      )}
    </div>
  );
}
