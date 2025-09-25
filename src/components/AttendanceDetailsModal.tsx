import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { type AttendanceData } from "@/store/api/attendanceApi";
import {
  Calendar,
  Clock,
  Edit,
  Plus,
  Trash2,
  User,
  X,
} from "lucide-react";
import { useState } from "react";

// Use the actual session type from the API
interface Session {
  startTime: string;
  endTime: string;
  note: string;
  _id: string;
}

interface AttendanceDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  employee: AttendanceData | null;
  selectedDay: number | null;
  selectedDate: string;
}

interface CreateSessionModalProps {
  isOpen: boolean;
  onClose: () => void;
  employee: AttendanceData | null;
  selectedDate: string;
  onSave: (sessionData: any) => void;
}

interface EditSessionModalProps {
  isOpen: boolean;
  onClose: () => void;
  session: Session | null;
  onSave: (sessionData: any) => void;
  onDelete: () => void;
}

// Format time for display
const formatTime = (dateString: string) => {
  return new Date(dateString).toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true
  });
};

// Create Session Modal
function CreateSessionModal({ isOpen, onClose, employee, selectedDate, onSave }: CreateSessionModalProps) {
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');
  const [note, setNote] = useState('');

  const handleSave = () => {
    if (!startTime || !endTime) return;

    onSave({
      startTime,
      endTime,
      note,
      needApproval: false
    });

    // Reset form
    setStartTime('');
    setEndTime('');
    setNote('');
    onClose();
  };

  const handleCancel = () => {
    setStartTime('');
    setEndTime('');
    setNote('');
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Plus className="h-5 w-5 text-blue-600" />
            Create Session
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div className="space-y-2 text-sm text-muted-foreground">
            <div>User: <span className="font-medium text-foreground">{employee?.user.name}</span></div>
            <div>Date: <span className="font-medium text-foreground">{selectedDate}</span></div>
          </div>

          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Start Time</label>
              <Input
                type="time"
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
                placeholder="--:-- --"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">End Time</label>
              <Input
                type="time"
                value={endTime}
                onChange={(e) => setEndTime(e.target.value)}
                placeholder="--:-- --"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Note</label>
              <textarea
                className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                value={note}
                onChange={(e) => setNote(e.target.value)}
                placeholder="Enter note..."
              />
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-2">
          <Button variant="outline" onClick={handleCancel}>
            Cancel
          </Button>
          <Button
            onClick={handleSave}
            disabled={!startTime || !endTime}
            className="bg-blue-600 hover:bg-blue-700"
          >
            Save
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

// Edit Session Modal
function EditSessionModal({ isOpen, onClose, session, onSave, onDelete }: EditSessionModalProps) {
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');
  const [note, setNote] = useState('');

  // Update form when session changes
  useState(() => {
    if (session) {
      const start = new Date(session.startTime);
      const end = new Date(session.endTime);
      setStartTime(`${start.getHours().toString().padStart(2, '0')}:${start.getMinutes().toString().padStart(2, '0')}`);
      setEndTime(`${end.getHours().toString().padStart(2, '0')}:${end.getMinutes().toString().padStart(2, '0')}`);
      setNote(session.note || '');
    }
  });

  const handleSave = () => {
    if (!startTime || !endTime || !session) return;

    onSave({
      ...session,
      startTime,
      endTime,
      note
    });
    onClose();
  };

  if (!session) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Edit className="h-5 w-5 text-blue-600" />
            Edit Session
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Start Time</label>
              <Input
                type="time"
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">End Time</label>
              <Input
                type="time"
                value={endTime}
                onChange={(e) => setEndTime(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Note</label>
              <textarea
                className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                value={note}
                onChange={(e) => setNote(e.target.value)}
                placeholder="Enter note..."
              />
            </div>
          </div>
        </div>

        <div className="flex justify-between">
          <Button variant="destructive" onClick={onDelete} className="flex items-center gap-2">
            <Trash2 className="h-4 w-4" />
            Delete
          </Button>
          <div className="flex gap-2">
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button
              onClick={handleSave}
              disabled={!startTime || !endTime}
              className="bg-blue-600 hover:bg-blue-700"
            >
              Save
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

// Main Attendance Details Modal
export default function AttendanceDetailsModal({
  isOpen,
  onClose,
  employee,
  selectedDay,
  selectedDate
}: AttendanceDetailsModalProps) {
  const [showCreateSession, setShowCreateSession] = useState(false);
  const [showEditSession, setShowEditSession] = useState(false);
  const [selectedSession, setSelectedSession] = useState<Session | null>(null);

  if (!employee || !selectedDay) return null;

  const attendanceDay = employee.attendances.find(att => att.day === selectedDay);
  const sessions = attendanceDay?.sessions || [];
  const duration = attendanceDay?.duration || 0;
  const overTimeDuration = attendanceDay?.overTimeDuration || 0;
  const isOvertimeApproved = attendanceDay?.isOvertimeApproved;

  const handleCreateSession = (sessionData: any) => {
    console.log('Creating session:', sessionData);
    // Here you would call your API to create the session
  };

  const handleEditSession = (sessionData: any) => {
    console.log('Editing session:', sessionData);
    // Here you would call your API to edit the session
  };

  const handleDeleteSession = () => {
    if (selectedSession) {
      console.log('Deleting session:', selectedSession._id);
      // Here you would call your API to delete the session
      setShowEditSession(false);
      setSelectedSession(null);
    }
  };

  const handleEditClick = (session: Session) => {
    setSelectedSession(session);
    setShowEditSession(true);
  };

  return (
    <>
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="sm:max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center justify-between">
              <span>Attendance Details</span>
              <Button variant="ghost" size="sm" onClick={onClose}>
                <X className="h-4 w-4" />
              </Button>
            </DialogTitle>
          </DialogHeader>

          {/* Employee and Date Info */}
          <div className="grid grid-cols-3 gap-4 p-4 bg-muted/30 rounded-lg">
            <div className="flex items-center gap-2">
              <div className="p-2 bg-blue-100 rounded-full">
                <User className="h-4 w-4 text-blue-600" />
              </div>
              <div>
                <div className="text-xs text-muted-foreground">Employee</div>
                <div className="font-medium">{employee.user.name}</div>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <div className="p-2 bg-green-100 rounded-full">
                <Calendar className="h-4 w-4 text-green-600" />
              </div>
              <div>
                <div className="text-xs text-muted-foreground">Date</div>
                <div className="font-medium">{selectedDate}</div>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <div className="p-2 bg-purple-100 rounded-full">
                <Clock className="h-4 w-4 text-purple-600" />
              </div>
              <div>
                <div className="text-xs text-muted-foreground">Duration</div>
                <div className="font-medium flex items-center gap-2">
                  {duration} Hours
                  {overTimeDuration > 0 && (
                    <Badge
                      variant="outline"
                      className={cn(
                        "text-xs px-1 py-0",
                        isOvertimeApproved === true && "bg-green-100 text-green-800 border-green-200",
                        isOvertimeApproved === false && "bg-red-100 text-red-800 border-red-200",
                        isOvertimeApproved === null && "bg-gray-100 text-gray-800 border-gray-200"
                      )}
                    >
                      + {overTimeDuration}.00 hrs OT{' '}
                      {isOvertimeApproved === true ? 'Overtime Approved' :
                        isOvertimeApproved === false ? 'Overtime Rejected' :
                          'Overtime Pending'}
                    </Badge>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Sessions Section */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold">Sessions</h3>
              <Button
                onClick={() => setShowCreateSession(true)}
                className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700"
              >
                <Plus className="h-4 w-4" />
                Add Session
              </Button>
            </div>

            {sessions.length === 0 ? (
              <Card>
                <CardContent className="p-6 text-center">
                  <div className="text-muted-foreground">
                    No sessions recorded for this day
                  </div>
                  <Button
                    onClick={() => setShowCreateSession(true)}
                    className="mt-4 bg-blue-600 hover:bg-blue-700"
                  >
                    Create First Session
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-3">
                {sessions.map((session) => (
                  <Card key={session._id} className="border border-border">
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between">
                        <div className="space-y-2 flex-1">
                          <div className="flex items-center gap-2">
                            <Badge variant="outline" className="bg-blue-50 text-blue-700">
                              Session
                            </Badge>
                          </div>

                          <div className="grid grid-cols-2 gap-4 text-sm">
                            <div>
                              <div className="text-muted-foreground">Start Time</div>
                              <div className="font-medium">{formatTime(session.startTime)}</div>
                            </div>
                            <div>
                              <div className="text-muted-foreground">End Time</div>
                              <div className="font-medium">{formatTime(session.endTime)}</div>
                            </div>
                          </div>

                          <div>
                            <div className="text-muted-foreground text-sm">Note</div>
                            <div className="text-sm italic text-muted-foreground">
                              {session.note || 'No notes added'}
                            </div>
                          </div>
                        </div>

                        <div className="flex gap-1 ml-4">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleEditClick(session)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              setSelectedSession(session);
                              handleDeleteSession();
                            }}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>

      {/* Create Session Modal */}
      <CreateSessionModal
        isOpen={showCreateSession}
        onClose={() => setShowCreateSession(false)}
        employee={employee}
        selectedDate={selectedDate}
        onSave={handleCreateSession}
      />

      {/* Edit Session Modal */}
      <EditSessionModal
        isOpen={showEditSession}
        onClose={() => {
          setShowEditSession(false);
          setSelectedSession(null);
        }}
        session={selectedSession}
        onSave={handleEditSession}
        onDelete={handleDeleteSession}
      />
    </>
  );
}
