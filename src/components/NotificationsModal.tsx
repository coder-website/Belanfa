import React, { useState } from 'react';
import { 
  X, 
  Bell, 
  BellRing, 
  Sparkles, 
  Check, 
  Copy, 
  CheckCircle2
} from 'lucide-react';
import { PushPromo } from '../types';

interface NotificationsModalProps {
  promotions: PushPromo[];
  onClose: () => void;
}

export const NotificationsModal: React.FC<NotificationsModalProps> = ({
  promotions,
  onClose,
}) => {
  const [notificationsEnabled, setNotificationsEnabled] = useState(() => {
    return localStorage.getItem('belanfa_push_enabled') === 'true';
  });
  const [copiedCode, setCopiedCode] = useState<string | null>(null);
  const [requestStatus, setRequestStatus] = useState<string | null>(null);

  const handleTogglePush = async () => {
    if (!notificationsEnabled) {
      if ('Notification' in window) {
        try {
          const permission = await Notification.requestPermission();
          if (permission === 'granted') {
            setNotificationsEnabled(true);
            localStorage.setItem('belanfa_push_enabled', 'true');
            setRequestStatus('Notifications activées ! Vous recevrez nos alertes de match & promos.');
            new Notification('Restaurant Belanfa Casablanca', {
              body: 'Bienvenue chez Belanfa ! Profitez du code BELANFA10 pour 10% de réduction.',
              icon: '/favicon.ico',
            });
          } else {
            setNotificationsEnabled(true);
            localStorage.setItem('belanfa_push_enabled', 'true');
            setRequestStatus('Notifications enregistrées dans votre profil client.');
          }
        } catch (e) {
          setNotificationsEnabled(true);
          localStorage.setItem('belanfa_push_enabled', 'true');
          setRequestStatus('Notifications activées dans l’application.');
        }
      } else {
        setNotificationsEnabled(true);
        localStorage.setItem('belanfa_push_enabled', 'true');
        setRequestStatus('Notifications activées localement.');
      }
    } else {
      setNotificationsEnabled(false);
      localStorage.setItem('belanfa_push_enabled', 'false');
      setRequestStatus('Notifications désactivées.');
    }
  };

  const handleCopyCode = (code: string) => {
    navigator.clipboard?.writeText(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in">
      <div className="bg-white rounded-3xl max-w-md w-full overflow-hidden shadow-2xl border border-stone-200">
        
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-stone-200 flex items-center justify-between bg-stone-50">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-amber-800 text-white flex items-center justify-center">
              <BellRing className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-serif text-lg font-bold text-stone-900">
                Offres & Notifications Push
              </h3>
              <p className="text-[11px] text-stone-500">
                Promotions exclusives & alertes diffusion de match
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-stone-200 text-stone-700 flex items-center justify-center hover:bg-stone-300"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="p-4 sm:p-5 space-y-4 max-h-[75vh] overflow-y-auto">
          
          {/* Push Switch Box */}
          <div className="p-4 rounded-2xl bg-amber-50/70 border border-amber-200/80 flex items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-amber-600 text-white flex items-center justify-center shrink-0">
                <Bell className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-stone-900">
                  Alertes Bons Plans & Matchs
                </h4>
                <p className="text-[11px] text-stone-600">
                  Soyez prévenu dès l'ouverture des réservations pour les grands matchs
                </p>
              </div>
            </div>

            <button
              onClick={handleTogglePush}
              className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                notificationsEnabled ? 'bg-amber-800' : 'bg-stone-300'
              }`}
            >
              <span
                className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                  notificationsEnabled ? 'translate-x-5' : 'translate-x-0'
                }`}
              />
            </button>
          </div>

          {requestStatus && (
            <p className="text-[11px] text-emerald-700 bg-emerald-50 p-2 rounded-xl border border-emerald-200 flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5" />
              {requestStatus}
            </p>
          )}

          {/* Promotions list */}
          <div className="space-y-3 pt-2">
            <h4 className="text-xs font-bold uppercase tracking-wider text-stone-500">
              Promotions Actives à Belanfa :
            </h4>

            {promotions.map((promo) => (
              <div
                key={promo.id}
                className="p-4 rounded-2xl border border-stone-200 bg-stone-50 space-y-2 hover:border-amber-400 transition-colors"
              >
                <div className="flex items-start justify-between gap-2">
                  <h5 className="text-xs font-bold text-stone-900 flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                    {promo.title}
                  </h5>
                  <span className="text-[10px] text-stone-500 shrink-0 font-medium">
                    {promo.timestamp}
                  </span>
                </div>

                <p className="text-xs text-stone-600 leading-relaxed">
                  {promo.message}
                </p>

                {promo.discountCode && (
                  <div className="flex items-center justify-between pt-1">
                    <span className="text-[11px] font-mono font-bold bg-white px-2.5 py-1 rounded-lg border border-stone-300 text-amber-900">
                      {promo.discountCode}
                    </span>
                    <button
                      onClick={() => handleCopyCode(promo.discountCode!)}
                      className="text-xs font-semibold text-amber-800 hover:text-amber-900 flex items-center gap-1 cursor-pointer"
                    >
                      {copiedCode === promo.discountCode ? (
                        <>
                          <Check className="w-3.5 h-3.5 text-emerald-600" />
                          <span>Copié !</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3.5 h-3.5" />
                          <span>Copier le code</span>
                        </>
                      )}
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>

        </div>

        {/* Footer */}
        <div className="p-4 border-t border-stone-200 bg-stone-50 text-center">
          <button
            onClick={onClose}
            className="w-full py-2.5 bg-stone-900 text-white text-xs font-semibold rounded-xl hover:bg-stone-800 cursor-pointer"
          >
            Fermer
          </button>
        </div>

      </div>
    </div>
  );
};

