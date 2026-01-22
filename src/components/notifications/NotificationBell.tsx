import { motion } from "framer-motion";
import { Bell } from "lucide-react";
import { useNotificationStore } from "@/stores/notificationStore";
import { Button } from "@/components/ui/button";

interface NotificationBellProps {
  onClick: () => void;
}

const NotificationBell = ({ onClick }: NotificationBellProps) => {
  const { unreadCount, emergencyState, isConnected } = useNotificationStore();
  
  const hasUrgent = emergencyState !== 'NORMAL' || unreadCount > 0;
  
  return (
    <Button
      variant="ghost"
      size="icon"
      className="relative"
      onClick={onClick}
    >
      <motion.div
        animate={hasUrgent ? {
          rotate: [0, -15, 15, -15, 15, 0],
        } : {}}
        transition={{
          duration: 0.5,
          repeat: hasUrgent ? Infinity : 0,
          repeatDelay: 3,
        }}
      >
        <Bell className={`w-5 h-5 ${
          emergencyState !== 'NORMAL' ? 'text-destructive' : 
          unreadCount > 0 ? 'text-isabella' : 'text-muted-foreground'
        }`} />
      </motion.div>
      
      {/* Unread Badge */}
      {unreadCount > 0 && (
        <motion.span
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className={`absolute -top-1 -right-1 min-w-[18px] h-[18px] px-1 rounded-full text-[10px] font-bold flex items-center justify-center ${
            emergencyState !== 'NORMAL' ? 'bg-destructive' : 'bg-isabella'
          } text-white`}
        >
          {unreadCount > 99 ? '99+' : unreadCount}
        </motion.span>
      )}
      
      {/* Connection Indicator */}
      <span className={`absolute bottom-0 right-0 w-2 h-2 rounded-full ${
        isConnected ? 'bg-green-500' : 'bg-destructive'
      }`} />
    </Button>
  );
};

export default NotificationBell;
