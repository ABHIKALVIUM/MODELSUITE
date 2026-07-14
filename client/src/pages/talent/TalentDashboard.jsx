import { useEffect, useState } from 'react';
import TalentSidebar from '../../components/talent/TalentSidebar';
import AvailableTasksList from '../../components/talent/AvailableTasksList';
import MyTasksList from '../../components/talent/MyTasksList';
import { fetchAvailableTasks, fetchMyTasks } from '../../api/talent';
import { useAuth } from '../../context/AuthContext';
import { useToast, ToastContainer } from '../../components/Toast';

const TalentDashboard = () => {
  const { user } = useAuth();
  const [availableTasks, setAvailableTasks] = useState([]);
  const [myTasks, setMyTasks]               = useState([]);
  const { toasts, toast, removeToast } = useToast();

  const loadAvailable = async () => {
    try { const { data } = await fetchAvailableTasks(); setAvailableTasks(data); }
    catch { toast.error('Failed to load available tasks'); }
  };

  const loadMyTasks = async () => {
    try { const { data } = await fetchMyTasks(); setMyTasks(data); }
    catch { toast.error('Failed to load your tasks'); }
  };

  // eslint-disable-next-line
  useEffect(() => { loadAvailable(); loadMyTasks(); }, []);
  const handleRefresh = () => { loadAvailable(); loadMyTasks(); };

  return (
    <div className="flex min-h-screen" style={{ background: '#050505' }}>
      <TalentSidebar />

      <main className="ml-[220px] flex-1 px-8 py-8" style={{ maxWidth: 'calc(100vw - 220px)' }}>

        {/* Header */}
        <div className="mb-7 page-section">
          <h1 className="text-[22px] font-semibold tracking-tight"
            style={{ color: '#F0F0F0', fontFamily: 'Poppins, sans-serif' }}>
            Welcome back, {user?.name?.split(' ')[0]}
          </h1>
          <p className="mt-0.5 text-[13px]" style={{ color: '#6B7280' }}>
            Browse available tasks below and claim one to get started.
          </p>
        </div>

        {/* Available Tasks */}
        <section className="mb-7 page-section">
          <div className="flex items-center gap-2.5 mb-4">
            <h2 className="text-[11px] font-semibold uppercase tracking-[0.1em]"
              style={{ color: '#4B5563', fontFamily: 'Inter, sans-serif' }}>
              Available Tasks
            </h2>
            <span className="text-[10.5px] px-2 py-0.5 rounded-full"
              style={{
                background: 'rgba(255,255,255,0.05)',
                color: '#6B7280',
                border: '1px solid rgba(255,255,255,0.08)',
              }}>
              {availableTasks.length}
            </span>
          </div>
          <AvailableTasksList tasks={availableTasks} onClaimed={handleRefresh} toast={toast} />
        </section>

        {/* My Tasks */}
        <section className="mb-7 page-section">
          <div className="flex items-center gap-2.5 mb-4">
            <h2 className="text-[11px] font-semibold uppercase tracking-[0.1em]"
              style={{ color: '#4B5563', fontFamily: 'Inter, sans-serif' }}>
              My Tasks
            </h2>
            <span className="text-[10.5px] px-2 py-0.5 rounded-full"
              style={{
                background: 'rgba(255,255,255,0.05)',
                color: '#6B7280',
                border: '1px solid rgba(255,255,255,0.08)',
              }}>
              {myTasks.length}
            </span>
          </div>
          <MyTasksList tasks={myTasks} onRefresh={handleRefresh} toast={toast} />
        </section>
      </main>

      <ToastContainer toasts={toasts} removeToast={removeToast} />
    </div>
  );
};

export default TalentDashboard;
