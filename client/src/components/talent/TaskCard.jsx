import { claimTask } from '../../api/talent';

const STATUS_CLASS = {
  Open:      'status-badge-Open',
  Claimed:   'status-badge-Claimed',
  Submitted: 'status-badge-Submitted',
  Approved:  'status-badge-Approved',
  Rejected:  'status-badge-Rejected',
};

/* ── Deadline badge helper (Feature #14) ── */
const DeadlineBadge = ({ dueDate }) => {
  if (!dueDate) return null;
  const due = new Date(dueDate);
  if (isNaN(due)) return null;
  const now = new Date();
  const diffMs = due - now;
  const diffHrs = diffMs / (1000 * 60 * 60);

  if (diffMs < 0) {
    return <span className="badge-overdue">🔴 Overdue</span>;
  }
  if (diffHrs <= 24) {
    return <span className="badge-due-soon">⚠ Due Soon</span>;
  }
  return null;
};

const TaskCard = ({ task, showClaimButton = false, onClaimed, toast }) => {

  const handleClaim = async () => {
    try {
      await claimTask(task._id);
      toast?.success('Task claimed successfully!');
      if (onClaimed) onClaimed();
    } catch (err) {
      toast?.error(err.response?.data?.message || 'Failed to claim task');
    }
  };

  return (
    <div className="bg-bg-card border border-border rounded-xl p-5 flex flex-col gap-3 hover:border-border-light hover:-translate-y-0.5 transition-all cursor-default">

      {/* Header: title + status */}
      <div className="flex items-start justify-between gap-2.5">
        <p className="text-[15px] font-semibold text-text-primary leading-snug">{task.title || 'Untitled Task'}</p>
        {task.status && (
          <span className={`shrink-0 inline-block px-2.5 py-[3px] rounded-full text-[11px] font-semibold tracking-[0.3px] ${STATUS_CLASS[task.status] || ''}`}>
            {task.status}
          </span>
        )}
      </div>

      {task.description && (
        <p className="text-[13px] text-text-muted leading-relaxed">{task.description}</p>
      )}

      {/* Meta row: due date + deadline badge (Feature #14) */}
      <div className="flex items-center justify-between flex-wrap gap-2 mt-auto">
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
          <span className="text-[12px] text-text-faint">
            {task.dueDate ? `Due: ${task.dueDate}` : 'No due date'}
          </span>
          <DeadlineBadge dueDate={task.dueDate} />
        </div>
        {task.createdBy?.name && (
          <span className="text-[12px] text-text-faint">By {task.createdBy.name}</span>
        )}
      </div>

      {showClaimButton && (
        <button onClick={handleClaim}
          className="w-full py-2.5 rounded-lg border-none text-[13px] font-semibold text-white cursor-pointer btn-gradient font-sans mt-1">
          Claim Task →
        </button>
      )}
    </div>
  );
};

export default TaskCard;
