import { motion, AnimatePresence } from "framer-motion";
import { 
  Bell, X, AlertTriangle, Shield, Scale, Brain, 
  CheckCircle2, Info, Clock, ChevronRight
} from "lucide-react";
import { useNotificationStore, TAMVNotification, NotificationType } from "@/stores/notificationStore";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

const notificationConfig: Record<NotificationType, { 
  icon: typeof Bell; 
  color: string;
  bgColor: string;
}> = {
  TIME_UP_ALERT: { icon: Clock, color: 'text-amber-500', bgColor: 'bg-amber-500/20' },
  MSR_CRITICAL: { icon: Shield, color: 'text-destructive', bgColor: 'bg-destructive/20' },
  GOVERNANCE_VOTE: { icon: Scale, color: 'text-accent', bgColor: 'bg-accent/20' },
  ISABELLA_SENTENCE: { icon: Brain, color: 'text-isabella', bgColor: 'bg-isabella/20' },
  SECURITY_BREACH: { icon: AlertTriangle, color: 'text-destructive', bgColor: 'bg-destructive/20' },
  PROPOSAL_UPDATE: { icon: CheckCircle2, color: 'text-green-500', bgColor: 'bg-green-500/20' },
  SYSTEM_INFO: { icon: Info, color: 'text-muted-foreground', bgColor: 'bg-muted' },
  DIGNITY_ATTACK: { icon: AlertTriangle, color: 'text-destructive', bgColor: 'bg-destructive/20' },
};

const priorityColors = {
  low: 'border-muted',
  medium: 'border-amber-500/50',
  high: 'border-orange-500/50',
  critical: 'border-destructive animate-pulse',
};

interface NotificationItemProps {
  notification: TAMVNotification;
  onDismiss: () => void;
  onClick: () => void;
}

const NotificationItem = ({ notification, onDismiss, onClick }: NotificationItemProps) => {
  const config = notificationConfig[notification.type];
  const Icon = config.icon;
  
  return (
    <motion.div
      initial={{ opacity: 0, x: 20, height: 0 }}
      animate={{ opacity: 1, x: 0, height: 'auto' }}
      exit={{ opacity: 0, x: -20, height: 0 }}
      className={`p-3 rounded-lg border-l-2 ${priorityColors[notification.priority]} ${
        notification.read ? 'opacity-60' : ''
      } bg-muted/30 hover:bg-muted/50 transition-colors cursor-pointer`}
      onClick={onClick}
    >
      <div className="flex items-start gap-3">
        <div className={`p-2 rounded-lg ${config.bgColor}`}>
          <Icon className={`w-4 h-4 ${config.color}`} />
        </div>
        
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between gap-2">
            <p className="text-sm font-medium text-foreground truncate">
              {notification.title}
            </p>
            <Button
              variant="ghost"
              size="icon"
              className="h-5 w-5 shrink-0 opacity-0 group-hover:opacity-100"
              onClick={(e) => {
                e.stopPropagation();
                onDismiss();
              }}
            >
              <X className="w-3 h-3" />
            </Button>
          </div>
          <p className="text-xs text-muted-foreground line-clamp-2 mt-0.5">
            {notification.message}
          </p>
          <div className="flex items-center gap-2 mt-2">
            <span className="text-[10px] text-muted-foreground">
              {notification.timestamp.toLocaleTimeString()}
            </span>
            {notification.actionUrl && (
              <Badge variant="outline" className="text-[10px] h-4">
                <ChevronRight className="w-2 h-2 mr-0.5" />
                Ver más
              </Badge>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

interface NotificationCenterProps {
  isOpen: boolean;
  onClose: () => void;
}

const NotificationCenter = ({ isOpen, onClose }: NotificationCenterProps) => {
  const navigate = useNavigate();
  const { 
    notifications, 
    unreadCount, 
    markAsRead, 
    markAllAsRead,
    dismissNotification,
    emergencyState,
    isConnected,
  } = useNotificationStore();
  
  const visibleNotifications = notifications.filter((n) => !n.dismissed);
  
  const handleNotificationClick = (notification: TAMVNotification) => {
    markAsRead(notification.id);
    if (notification.actionUrl) {
      navigate(notification.actionUrl);
      onClose();
    }
  };
  
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-40"
            onClick={onClose}
          />
          
          {/* Panel */}
          <motion.div
            initial={{ opacity: 0, x: 20, scale: 0.95 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: 20, scale: 0.95 }}
            className="fixed right-4 top-20 z-50 w-96 max-h-[calc(100vh-6rem)] glass rounded-2xl overflow-hidden shadow-2xl"
          >
            {/* Header */}
            <div className="p-4 border-b border-muted">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Bell className="w-5 h-5 text-isabella" />
                  <h3 className="font-display font-semibold text-foreground">
                    Notificaciones
                  </h3>
                  {unreadCount > 0 && (
                    <Badge className="bg-isabella text-white text-xs">
                      {unreadCount}
                    </Badge>
                  )}
                </div>
                
                <div className="flex items-center gap-2">
                  {/* Connection Status */}
                  <div className={`w-2 h-2 rounded-full ${
                    isConnected ? 'bg-green-500' : 'bg-destructive'
                  } animate-pulse`} />
                  
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={markAllAsRead}
                    className="text-xs"
                  >
                    Marcar todo
                  </Button>
                </div>
              </div>
              
              {/* Emergency State Banner */}
              {emergencyState !== 'NORMAL' && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  className={`mt-3 p-2 rounded-lg text-center text-xs font-medium ${
                    emergencyState === 'LOCKDOWN' ? 'bg-destructive/20 text-destructive' :
                    emergencyState === 'CRISIS' ? 'bg-orange-500/20 text-orange-500' :
                    'bg-amber-500/20 text-amber-500'
                  }`}
                >
                  ⚠️ Protocolo {emergencyState} Activo
                </motion.div>
              )}
            </div>
            
            {/* Notifications List */}
            <ScrollArea className="h-[400px]">
              <div className="p-3 space-y-2">
                <AnimatePresence mode="popLayout">
                  {visibleNotifications.length === 0 ? (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="text-center py-12 text-muted-foreground"
                    >
                      <Bell className="w-12 h-12 mx-auto mb-3 opacity-30" />
                      <p className="text-sm">No hay notificaciones</p>
                    </motion.div>
                  ) : (
                    visibleNotifications.map((notification) => (
                      <NotificationItem
                        key={notification.id}
                        notification={notification}
                        onDismiss={() => dismissNotification(notification.id)}
                        onClick={() => handleNotificationClick(notification)}
                      />
                    ))
                  )}
                </AnimatePresence>
              </div>
            </ScrollArea>
            
            {/* Footer */}
            <div className="p-3 border-t border-muted bg-muted/20">
              <Button
                variant="ghost"
                size="sm"
                className="w-full text-xs text-muted-foreground"
                onClick={() => {
                  navigate('/governance');
                  onClose();
                }}
              >
                Ver Centro de Gobernanza
                <ChevronRight className="w-3 h-3 ml-1" />
              </Button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default NotificationCenter;
