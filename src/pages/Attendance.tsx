import Header from "@/components/layout/Header";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { cn } from "@/lib/utils";
import { useGetAttendanceQuery, type AttendanceData } from "@/store/api/attendanceApi";
import { Calendar, ChevronLeft, ChevronRight, Clock, User } from "lucide-react";
import { useMemo, useState } from "react";

// Helper function to get attendance for a specific day
const getAttendanceForDay = (employeeData: AttendanceData, day: number) => {
  return employeeData.attendances.find(att => att.day === day);
};

// Helper function to format duration
const formatDuration = (duration: number) => {
  if (duration === 0) return '-';
  const hours = Math.floor(duration);
  const minutes = Math.round((duration - hours) * 60);
  return minutes > 0 ? `${hours}h ${minutes}m` : `${hours}h`;
};

export default function AttendancePage() {
  const now = new Date();
  const [month, setMonth] = useState(now.getMonth() + 1);
  const [year, setYear] = useState(now.getFullYear());

  // Fetch attendance data
  const { data, isFetching } = useGetAttendanceQuery({ month, year });

  // Calculate days in month
  const daysInMonth = useMemo(() => {
    return new Date(year, month, 0).getDate();
  }, [month, year]);

  // Generate day headers
  const dayHeaders = useMemo(() => {
    const days = [];
    for (let i = 1; i <= daysInMonth; i++) {
      const date = new Date(year, month - 1, i);
      days.push({
        day: i,
        dayName: date.toLocaleDateString('en-US', { weekday: 'short' }),
        isWeekend: date.getDay() === 0 || date.getDay() === 6
      });
    }
    return days;
  }, [daysInMonth, month, year]);

  // Month navigation handlers
  const handlePreviousMonth = () => {
    if (month === 1) {
      setMonth(12);
      setYear(year - 1);
    } else {
      setMonth(month - 1);
    }
  };

  const handleNextMonth = () => {
    if (month === 12) {
      setMonth(1);
      setYear(year + 1);
    } else {
      setMonth(month + 1);
    }
  };

  const monthName = new Date(year, month - 1, 1).toLocaleDateString('en-US', { month: 'long' });
  const attendanceData = data?.result?.data || [];
  const totalEmployees = attendanceData.length;
  const totalHours = data?.result?.total_duration || 0;

  return (
    <div className="h-full w-full p-4 flex flex-col gap-4">
      {/* Header */}
      <Header
        title="Attendance"
        subTitle={`(${totalEmployees} employees)`}
        options={
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Clock className="h-4 w-4" />
              Total: {formatDuration(totalHours)}
            </div>
          </div>
        }
      />

      {/* Month Navigation */}
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Calendar className="h-5 w-5 text-muted-foreground" />
              <h2 className="text-lg font-semibold">{monthName} {year}</h2>
            </div>
            <div className="flex items-center gap-1">
              <Button
                variant="outline"
                size="sm"
                onClick={handlePreviousMonth}
                disabled={isFetching}
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={handleNextMonth}
                disabled={isFetching}
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Attendance Table */}
      <Card className="flex-1 min-h-0">
        <CardContent className="p-0 h-full">
          <div className="h-full overflow-auto">
            <Table>
              <TableHeader className="sticky top-0 bg-background z-10">
                <TableRow>
                  <TableHead className="sticky left-0 bg-background border-r min-w-[180px] z-20">
                    <div className="flex items-center gap-2">
                      <User className="h-4 w-4" />
                      Employee Name
                    </div>
                  </TableHead>
                  {dayHeaders.map(({ day, dayName, isWeekend }) => (
                    <TableHead
                      key={day}
                      className={cn(
                        "text-center min-w-[60px] p-2",
                        isWeekend && "bg-muted/30"
                      )}
                    >
                      <div className="flex flex-col items-center">
                        <span className="text-xs text-muted-foreground">{dayName}</span>
                        <span className="font-semibold">{day}</span>
                      </div>
                    </TableHead>
                  ))}
                  <TableHead className="text-center min-w-[100px] border-l">
                    Total Hours
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isFetching ? (
                  <TableRow>
                    <TableCell colSpan={dayHeaders.length + 2} className="text-center py-8">
                      Loading attendance data...
                    </TableCell>
                  </TableRow>
                ) : attendanceData.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={dayHeaders.length + 2} className="text-center py-8 text-muted-foreground">
                      No attendance data found for {monthName} {year}
                    </TableCell>
                  </TableRow>
                ) : (
                  attendanceData.map((employee) => (
                    <TableRow key={employee.user._id} className="hover:bg-muted/50">
                      <TableCell className="sticky left-0 bg-background border-r font-medium min-w-[180px] z-10">
                        <div className="flex flex-col">
                          <span className="font-medium">{employee.user.name}</span>
                          <span className="text-xs text-muted-foreground truncate">
                            {employee.user.email}
                          </span>
                        </div>
                      </TableCell>
                      {dayHeaders.map(({ day, isWeekend }) => {
                        const dayAttendance = getAttendanceForDay(employee, day);
                        return (
                          <TableCell
                            key={day}
                            className={cn(
                              "text-center p-2",
                              isWeekend && "bg-muted/10"
                            )}
                          >
                            {dayAttendance ? (
                              <div className="flex flex-col items-center gap-1">
                                <Badge
                                  variant={dayAttendance.duration > 8 ? "default" : dayAttendance.duration > 0 ? "secondary" : "outline"}
                                  className={cn(
                                    "text-xs px-1 py-0",
                                    dayAttendance.duration > 8 && "bg-green-100 text-green-800 border-green-200",
                                    dayAttendance.duration <= 8 && dayAttendance.duration > 0 && "bg-blue-100 text-blue-800 border-blue-200"
                                  )}
                                >
                                  {dayAttendance.duration}h
                                </Badge>
                                {dayAttendance.overTimeDuration > 0 && (
                                  <Badge
                                    variant="outline"
                                    className={cn(
                                      "text-xs px-1 py-0",
                                      dayAttendance.isOvertimeApproved === true && "bg-orange-100 text-orange-800 border-orange-200",
                                      dayAttendance.isOvertimeApproved === false && "bg-red-100 text-red-800 border-red-200",
                                      dayAttendance.isOvertimeApproved === null && "bg-gray-100 text-gray-800 border-gray-200"
                                    )}
                                  >
                                    +{dayAttendance.overTimeDuration}h OT
                                  </Badge>
                                )}
                              </div>
                            ) : (
                              <span className="text-muted-foreground">-</span>
                            )}
                          </TableCell>
                        );
                      })}
                      <TableCell className="text-center border-l font-semibold">
                        <Badge
                          variant={employee.total_duration > 0 ? "default" : "outline"}
                          className={cn(
                            employee.total_duration > 0 && "bg-green-100 text-green-800 border-green-200"
                          )}
                        >
                          {formatDuration(employee.total_duration)}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}