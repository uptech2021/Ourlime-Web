'use client';

import { useEffect, useState } from 'react';
import { Plus, Loader2, Edit2, Trash2, Calendar, Grid, Download, Copy, Clock, X, Mail } from 'lucide-react';
import { useProfileStore } from '@/src/store/useProfileStore';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { List } from 'lucide-react';
import { TestReminderService } from '@/lib/schedule/test/TestReminderService';

type RecurringType = 'weekly' | 'monthly';

interface Schedule {
    id: string;
    subject: string;
    startTime: string;
    endTime: string;
    day: string;
    status: 'upcoming' | 'passed';
    color: string;
    isRecurring: boolean;
    recurringType: RecurringType;
    weekNumber?: number;
    monthNumber?: number;
    reminders: {
        email: boolean;
        whatsapp: boolean;
    };
}

interface FormData {
    subject: string;
    startTime: string;
    endTime: string;
    day: string;
    color: string;
    isRecurring: boolean;
    recurringType: RecurringType;
    reminders: {
        email: boolean;
        whatsapp: boolean;
    };
}

interface Template {
    name: string;
    schedules: Omit<Schedule, 'id' | 'status'>[];
}


export default function Schedule() {
    const [schedules, setSchedules] = useState<Schedule[]>([]);
    const [showAddForm, setShowAddForm] = useState(false);
    const [showEditForm, setShowEditForm] = useState(false);
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
    const [showTemplateModal, setShowTemplateModal] = useState(false);
    const [loading, setLoading] = useState(true);
    const [selectedSchedule, setSelectedSchedule] = useState<Schedule | null>(null);
    const [viewMode, setViewMode] = useState<'grid' | 'calendar'>('grid');
    const [templateName, setTemplateName] = useState('');

    const userData = useProfileStore();
    const timeSlots = ["8:00", "9:00", "10:00", "11:00", "12:00", "13:00", "14:00", "15:00", "16:00", "17:00", "18:00"];
    const daysOfWeek = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];
    const colors = ['#00ff5e', '#ff0000', '#0000ff', '#ffff00', '#ff00ff', '#00ffff', '#ffa500', '#800080'];

    const [templates, setTemplates] = useState<Template[]>([]);
    const [selectedSchedules, setSelectedSchedules] = useState<string[]>([]);

    const [showTemplateListModal, setShowTemplateListModal] = useState(false);

    const [formData, setFormData] = useState<FormData>({
        subject: '',
        startTime: '8:00',
        endTime: '9:00',
        day: 'Monday',
        color: '#00ff5e',
        isRecurring: false,
        recurringType: 'weekly',
        reminders: {
            email: true,
            whatsapp: false
        }
    });

    // Fetch schedules on component mount
    useEffect(() => {
        fetchSchedules();
    }, [userData.id]);

    const fetchSchedules = async () => {
        if (!userData.id) return;
        setLoading(true);

        try {
            const response = await fetch(`/api/schedules?userId=${userData.id}`);
            const data = await response.json();

            if (response.ok) {
                const updatedSchedules = data.schedules.map((schedule: Schedule) => ({
                    ...schedule,
                    status: determineStatus(schedule)
                }));
                setSchedules(updatedSchedules);
            }
        } catch (error) {
            console.error('Error fetching schedules:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!validateTimeConflicts(formData as Schedule)) {
            alert('Time slot conflict! Please choose a different time.');
            return;
        }

        try {
            let schedulesToAdd: Schedule[] = [];

            if (formData.isRecurring) {
                if (formData.recurringType === 'weekly') {
                    for (let week = 0; week < 4; week++) {
                        schedulesToAdd.push({
                            id: `schedule_${Date.now()}_${week}`,
                            ...formData,
                            weekNumber: week + 1,
                            status: 'upcoming'
                        });
                    }
                } else {
                    for (let month = 0; month < 3; month++) {
                        schedulesToAdd.push({
                            id: `schedule_${Date.now()}_${month}`,
                            ...formData,
                            monthNumber: month + 1,
                            status: 'upcoming'
                        });
                    }
                }
            } else {
                schedulesToAdd.push({
                    id: `schedule_${Date.now()}`,
                    ...formData,
                    status: 'upcoming'
                });
            }

            const response = await fetch('/api/schedules', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    userId: userData.id,
                    schedules: schedulesToAdd
                })
            });

            if (response.ok) {
                await fetchSchedules();
                setShowAddForm(false);
                resetForm();
            }
        } catch (error) {
            console.error('Error adding schedule:', error);
        }
    };

    const handleEdit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedSchedule) return;

        try {
            const response = await fetch('/api/schedules', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    userId: userData.id,
                    scheduleId: selectedSchedule.id,
                    updatedSchedule: formData
                })
            });

            if (response.ok) {
                await fetchSchedules();
                setShowEditForm(false);
                resetForm();
            }
        } catch (error) {
            console.error('Error updating schedule:', error);
        }
    };

    const handleDelete = async () => {
        if (!selectedSchedule) return;

        try {
            const response = await fetch(`/api/schedules?userId=${userData.id}&scheduleId=${selectedSchedule.id}`, {
                method: 'DELETE'
            });

            if (response.ok) {
                await fetchSchedules();
                setShowDeleteConfirm(false);
                setSelectedSchedule(null);
            }
        } catch (error) {
            console.error('Error deleting schedule:', error);
        }
    };

    // Add these functions
    const formatDateForICS = (day: string, time: string): string => {
        const date = getNextDayDate(day);
        const [hours] = time.split(':');
        date.setHours(parseInt(hours));
        return date.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
    };

    const getNextDayDate = (day: string): Date => {
        const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
        const today = new Date();
        const dayIndex = days.indexOf(day);
        const todayIndex = today.getDay() - 1;
        const daysUntilNext = (dayIndex - todayIndex + 7) % 7;
        const nextDate = new Date(today);
        nextDate.setDate(today.getDate() + daysUntilNext);
        return nextDate;
    };

    const generateICSFile = (schedules: Schedule[]): string => {
        let icsContent = [
            'BEGIN:VCALENDAR',
            'VERSION:2.0',
            'PRODID:-//Ourlime//Schedule//EN'
        ];

        schedules.forEach(schedule => {
            icsContent = icsContent.concat([
                'BEGIN:VEVENT',
                `SUMMARY:${schedule.subject}`,
                `DTSTART:${formatDateForICS(schedule.day, schedule.startTime)}`,
                `DTEND:${formatDateForICS(schedule.day, schedule.endTime)}`,
                'END:VEVENT'
            ]);
        });

        icsContent.push('END:VCALENDAR');
        return icsContent.join('\r\n');
    };

    const exportToCalendar = () => {
        const icsContent = generateICSFile(schedules);
        const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
        const link = document.createElement('a');
        link.href = window.URL.createObjectURL(blob);
        link.download = 'schedule.ics';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const saveAsTemplate = async (name: string) => {
        if (!name.trim() || !userData.id) return;

        const newTemplate = {
            name,
            schedules: selectedSchedules.map(id => {
                const schedule = schedules.find(s => s.id === id);
                if (!schedule) return null;
                const { id: _, status: __, ...rest } = schedule;
                return rest;
            }).filter(Boolean)
        };

        try {
            const response = await fetch('/api/schedules/template', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    userId: userData.id,
                    template: newTemplate
                })
            });

            if (response.ok) {
                setTemplates(prev => [...prev, newTemplate]);
                setTemplateName('');
                setShowTemplateModal(false);
            }
        } catch (error) {
            console.error('Error saving template:', error);
        }
    };

    // Helper functions
    const resetForm = () => {
        setFormData({
            subject: '',
            startTime: '8:00',
            endTime: '9:00',
            day: 'Monday',
            color: '#00ff5e',
            isRecurring: false,
            recurringType: 'weekly',
            reminders: {
                email: true,
                whatsapp: false
            }
        });
    };

    const determineStatus = (schedule: Schedule): 'upcoming' | 'passed' => {
        const now = new Date();
        const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
        const today = days[now.getDay() - 1];
        const currentHour = now.getHours();

        const scheduleHour = parseInt(schedule.startTime);
        const scheduleDay = schedule.day;
        const dayIndex = days.indexOf(scheduleDay);
        const todayIndex = days.indexOf(today);

        if (dayIndex > todayIndex || (dayIndex === todayIndex && scheduleHour > currentHour)) {
            return 'upcoming';
        }
        return 'passed';
    };

    const validateTimeConflicts = (newSchedule: Schedule): boolean => {
        return !schedules.some(existing =>
            existing.day === newSchedule.day &&
            existing.id !== newSchedule.id &&
            ((parseInt(newSchedule.startTime) >= parseInt(existing.startTime) &&
                parseInt(newSchedule.startTime) < parseInt(existing.endTime)) ||
                (parseInt(newSchedule.endTime) > parseInt(existing.startTime) &&
                    parseInt(newSchedule.endTime) <= parseInt(existing.endTime)))
        );
    };

    const renderTimeSlot = (day: string, time: string) => {
        const slotSchedules = schedules.filter(schedule =>
            schedule.day === day && schedule.startTime === time
        );

        return slotSchedules.map(schedule => (
            <div
                key={schedule.id}
                style={{ backgroundColor: schedule.color }}
                className="p-2 rounded-lg shadow-sm cursor-pointer"
            >
                <div className="flex items-center gap-2">
                    <input
                        title='Select'
                        type="checkbox"
                        checked={selectedSchedules.includes(schedule.id)}
                        onChange={(e) => {
                            e.stopPropagation();
                            setSelectedSchedules(prev =>
                                prev.includes(schedule.id)
                                    ? prev.filter(id => id !== schedule.id)
                                    : [...prev, schedule.id]
                            );
                        }}
                        className="w-4 h-4 text-greenTheme bg-white border-gray-300 rounded focus:ring-greenTheme focus:ring-2"
                    />
                    <div
                        onClick={() => {
                            setSelectedSchedule(schedule);
                            setFormData({
                                ...schedule,
                                recurringType: schedule.recurringType || 'weekly'
                            });
                            setShowEditForm(true);
                        }}
                    >
                        <p className="text-sm font-medium">{schedule.subject}</p>
                        <p className="text-xs">{`${schedule.startTime}-${schedule.endTime}`}</p>
                        {schedule.isRecurring && (
                            <p className="text-xs italic">
                                {schedule.recurringType === 'weekly' ? 'Weekly' : 'Monthly'}
                            </p>
                        )}
                    </div>
                </div>
            </div>
        ));
    };

    const onDragEnd = (result: any) => {
        if (!result.destination) return;

        const items = Array.from(schedules);
        const [reorderedItem] = items.splice(result.source.index, 1);
        items.splice(result.destination.index, 0, reorderedItem);

        setSchedules(items);
    };

    useEffect(() => {
        const loadTemplates = async () => {
            if (!userData.id) return;

            try {
                const response = await fetch(`/api/schedules/template?userId=${userData.id}`);

                if (response.ok) {
                    const data = await response.json();
                    setTemplates(data.templates);
                }
            } catch (error) {
                console.error('Error loading templates:', error);
            }
        };

        loadTemplates();
    }, [userData.id]);


    type DragResult = {
        destination?: {
            index: number;
        };
        source: {
            index: number;
        };
    };

    return (
        <div className="lg:col-span-12" title="Schedule Component">
            <div className="bg-white rounded-xl shadow-sm p-4">
                {/* Enhanced Header with View Toggle and Actions */}
                <div className="flex flex-wrap justify-between items-center mb-6 gap-4">
                    <h2 className="text-xl font-semibold text-gray-800">Class Schedule</h2>

                    <button
                        className="px-4 py-2 bg-greenTheme text-white rounded-lg hover:bg-green-600 transition-colors flex items-center gap-2 shadow-sm"
                        onClick={async () => {
                            try {
                                const response = await fetch('/api/test/email', {
                                    method: 'POST',
                                    headers: { 'Content-Type': 'application/json' },
                                    body: JSON.stringify({ email: userData.email })
                                });
                                const data = await response.json();
                                console.log('Test email result:', data);
                            } catch (error) {
                                console.log('Test email error:', error);
                            }
                        }}
                    >
                        <Mail className="w-4 h-4" />
                        Test Email Notification
                    </button>


                    <div className="flex items-center gap-3">
                        {/* View Toggle */}
                        <div className="flex bg-gray-100 rounded-lg p-1">
                            <button
                                onClick={() => setViewMode('grid')}
                                className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${viewMode === 'grid'
                                    ? 'bg-white text-gray-800 shadow-sm'
                                    : 'text-gray-600 hover:text-gray-800'
                                    }`}
                                aria-label="Grid View"
                            >
                                <Grid className="w-4 h-4" />
                            </button>
                            <button
                                onClick={() => setViewMode('calendar')}
                                className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${viewMode === 'calendar'
                                    ? 'bg-white text-gray-800 shadow-sm'
                                    : 'text-gray-600 hover:text-gray-800'
                                    }`}
                                aria-label="Calendar View"
                            >
                                <Calendar className="w-4 h-4" />
                            </button>
                            <button
                                onClick={() => setShowTemplateListModal(true)}
                                className="p-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors"
                                title="View Templates"
                                aria-label="View Templates"
                            >
                                <List className="w-4 h-4" />
                            </button>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex items-center gap-2">
                            <button
                                onClick={exportToCalendar}
                                className="p-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors"
                                title="Export Schedule"
                                aria-label="Export Schedule"
                            >
                                <Download className="w-4 h-4" />
                            </button>
                            <button
                                onClick={() => {
                                    console.log('Template modal opening');
                                    setShowTemplateModal(true);
                                }}
                                className="p-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors"
                                title="Save as Template"
                                aria-label="Save as Template"
                            >
                                <Copy className="w-4 h-4" />
                            </button>

                            <button
                                onClick={() => setShowAddForm(true)}
                                className="flex items-center gap-2 px-4 py-2 bg-greenTheme text-white rounded-lg hover:bg-green-600 transition-colors"
                                aria-label="Add New Class"
                            >
                                <Plus className="w-4 h-4" />
                                <span>Add Class</span>
                            </button>
                        </div>
                    </div>
                </div>

                {/* Schedule Content */}
                {loading ? (
                    <div className="flex items-center justify-center h-64" aria-label="Loading">
                        <Loader2 className="w-8 h-8 animate-spin text-greenTheme" />
                    </div>
                ) : viewMode === 'grid' ? (
                    <DragDropContext onDragEnd={(result: DragResult) => onDragEnd(result)}>
                        <div className="relative">
                            <div className="flex">
                                {/* Fixed Time Column */}
                                <div className="flex-none w-16 sm:w-20 bg-white z-10">
                                    <div className="h-12"></div>
                                    {timeSlots.map((time) => (
                                        <div key={time} className="h-12 flex items-center justify-end pr-2 sm:pr-4">
                                            <span className="text-xs sm:text-sm text-gray-500">{time}</span>
                                        </div>
                                    ))}
                                </div>

                                {/* Scrollable Content */}
                                <div className="flex-1 overflow-x-auto">
                                    <div className="min-w-[500px] sm:min-w-[600px]">
                                        {/* Days Header */}
                                        <div className="grid grid-cols-5 gap-1 sm:gap-2 mb-4">
                                            {daysOfWeek.map(day => (
                                                <div key={day} className="text-center text-xs sm:text-sm font-medium text-gray-700">
                                                    {day}
                                                </div>
                                            ))}
                                        </div>

                                        {/* Droppable Schedule Grid */}
                                        <Droppable droppableId="schedule-grid">
                                            {(provided) => (
                                                <div
                                                    {...provided.droppableProps}
                                                    ref={provided.innerRef}
                                                >
                                                    {timeSlots.map((time) => (
                                                        <div key={time} className="grid grid-cols-5 gap-1 sm:gap-2 mb-2">
                                                            {daysOfWeek.map(day => (
                                                                <Draggable
                                                                    key={`${day}-${time}`}
                                                                    draggableId={`${day}-${time}`}
                                                                    index={timeSlots.indexOf(time) * 5 + daysOfWeek.indexOf(day)}
                                                                >
                                                                    {(provided, snapshot) => (
                                                                        <div
                                                                            ref={provided.innerRef}
                                                                            {...provided.draggableProps}
                                                                            {...provided.dragHandleProps}
                                                                            className={`min-h-[48px] relative ${snapshot.isDragging ? 'z-50' : ''
                                                                                }`}
                                                                        >
                                                                            {renderTimeSlot(day, time)}
                                                                        </div>
                                                                    )}
                                                                </Draggable>
                                                            ))}
                                                        </div>
                                                    ))}
                                                    {provided.placeholder}
                                                </div>
                                            )}
                                        </Droppable>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </DragDropContext>
                ) : (
                    <div className="calendar-view">
                        {/* Calendar view implementation */}
                        <div className="text-center text-gray-500 py-8">
                            Calendar view coming soon...
                        </div>
                    </div>
                )}
            </div>

            {/* Add/Edit Form Modal */}
            {(showAddForm || showEditForm) && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-xl p-6 w-full max-w-md relative">
                        <button
                            onClick={() => {
                                showAddForm ? setShowAddForm(false) : setShowEditForm(false);
                                resetForm();
                            }}
                            className="absolute top-4 right-4 p-1 hover:bg-gray-100 rounded-full transition-colors"
                            aria-label="Close Modal"
                        >
                            <X className="w-5 h-5 text-gray-500" />
                        </button>

                        <h3 className="text-lg font-semibold mb-4">
                            {showAddForm ? 'Add New Class' : 'Edit Class'}
                        </h3>

                        <form onSubmit={showAddForm ? handleSubmit : handleEdit} className="space-y-4">
                            {/* Form fields */}
                            <div>
                                <label htmlFor="subject" className="block text-sm font-medium mb-1">Subject</label>
                                <input
                                    id="subject"
                                    type="text"
                                    value={formData.subject}
                                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-greenTheme"
                                    placeholder="Enter subject name"
                                    required
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label htmlFor="startTime" className="block text-sm font-medium mb-1">Start Time</label>
                                    <select
                                        id="startTime"
                                        value={formData.startTime}
                                        onChange={(e) => setFormData({ ...formData, startTime: e.target.value })}
                                        className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-greenTheme"
                                    >
                                        {timeSlots.map(time => (
                                            <option key={time} value={time}>{time}</option>
                                        ))}
                                    </select>
                                </div>
                                <div>
                                    <label htmlFor="endTime" className="block text-sm font-medium mb-1">End Time</label>
                                    <select
                                        id="endTime"
                                        value={formData.endTime}
                                        onChange={(e) => setFormData({ ...formData, endTime: e.target.value })}
                                        className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-greenTheme"
                                    >
                                        {timeSlots.filter(time => parseInt(time) > parseInt(formData.startTime)).map(time => (
                                            <option key={time} value={time}>{time}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>

                            <div>
                                <label htmlFor="day" className="block text-sm font-medium mb-1">Day</label>
                                <select
                                    id="day"
                                    value={formData.day}
                                    onChange={(e) => setFormData({ ...formData, day: e.target.value })}
                                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-greenTheme"
                                >
                                    {daysOfWeek.map(day => (
                                        <option key={day} value={day}>{day}</option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-medium mb-2">Color</label>
                                <div className="flex gap-2 flex-wrap">
                                    {colors.map(color => (
                                        <button
                                            key={color}
                                            type="button"
                                            onClick={() => setFormData({ ...formData, color })}
                                            className={`w-6 h-6 rounded-full ${formData.color === color ? 'ring-2 ring-offset-2 ring-gray-400' : ''
                                                }`}
                                            style={{ backgroundColor: color }}
                                            aria-label={`Select color ${color}`}
                                        />
                                    ))}
                                </div>
                            </div>

                            <div>
                                <label className="flex items-center gap-2">
                                    <input
                                        type="checkbox"
                                        checked={formData.isRecurring}
                                        onChange={(e) => setFormData({
                                            ...formData,
                                            isRecurring: e.target.checked
                                        })}
                                        className="rounded text-greenTheme focus:ring-greenTheme"
                                    />
                                    <span className="text-sm font-medium">Recurring Schedule</span>
                                </label>
                                {formData.isRecurring && (
                                    <select
                                        id="recurringType"
                                        name="recurringType"
                                        aria-label="Recurring Schedule Type"
                                        value={formData.recurringType}
                                        onChange={(e) => setFormData({
                                            ...formData,
                                            recurringType: e.target.value as RecurringType
                                        })}
                                        className="mt-2 w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-greenTheme"
                                    >
                                        <option value="weekly">Weekly</option>
                                        <option value="monthly">Monthly</option>
                                    </select>
                                )}

                            </div>

                            <div>
                                <label className="block text-sm font-medium mb-2">Reminders</label>
                                <div className="flex items-center gap-4">
                                    <label className="flex items-center gap-2">
                                        <input
                                            type="checkbox"
                                            checked={formData.reminders.email}
                                            onChange={(e) => setFormData({
                                                ...formData,
                                                reminders: { ...formData.reminders, email: e.target.checked }
                                            })}
                                            className="rounded text-greenTheme focus:ring-greenTheme"
                                        />
                                        <span className="text-sm">Email</span>
                                    </label>
                                    <label className="flex items-center gap-2">
                                        <input
                                            type="checkbox"
                                            checked={formData.reminders.whatsapp}
                                            onChange={(e) => setFormData({
                                                ...formData,
                                                reminders: { ...formData.reminders, whatsapp: e.target.checked }
                                            })}
                                            className="rounded text-greenTheme focus:ring-greenTheme"
                                        />
                                        <span className="text-sm">WhatsApp</span>
                                    </label>
                                </div>
                            </div>

                            <div className="flex justify-end gap-2 mt-6">
                                <button
                                    type="submit"
                                    className="px-4 py-2 text-sm bg-greenTheme text-white rounded-lg hover:bg-green-600"
                                >
                                    {showAddForm ? 'Add Class' : 'Save Changes'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}


            {/* Template Modal */}
            {showTemplateModal && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-xl p-6 w-full max-w-md">
                        <h3 className="text-lg font-semibold mb-4">Save as Template</h3>
                        <div className="space-y-4">
                            <input
                                type="text"
                                placeholder="Template Name"
                                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-greenTheme"
                                value={templateName}
                                onChange={(e) => setTemplateName(e.target.value)}
                            />
                            <div className="max-h-40 overflow-y-auto">
                                {selectedSchedules.map(id => {
                                    const schedule = schedules.find(s => s.id === id);
                                    return schedule && (
                                        <div key={id} className="p-2 bg-gray-50 rounded mb-2">
                                            <p className="text-sm font-medium">{schedule.subject}</p>
                                            <p className="text-xs text-gray-600">
                                                {schedule.day} {schedule.startTime}-{schedule.endTime}
                                            </p>
                                        </div>
                                    );
                                })}
                            </div>
                            <div className="flex justify-end gap-2">
                                <button
                                    onClick={() => {
                                        setShowTemplateModal(false);
                                        setSelectedSchedules([]);
                                    }}
                                    className="px-4 py-2 text-sm border rounded-lg hover:bg-gray-50"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={() => {
                                        saveAsTemplate(templateName);
                                        setSelectedSchedules([]);
                                    }}
                                    className="px-4 py-2 text-sm bg-greenTheme text-white rounded-lg hover:bg-green-600"
                                    disabled={selectedSchedules.length === 0 || !templateName.trim()}
                                >
                                    Save Template
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}


            {/* Delete Confirmation Modal */}
            {showDeleteConfirm && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-xl p-6 w-full max-w-sm">
                        <h3 className="text-lg font-semibold mb-2">Delete Schedule</h3>
                        <p className="text-gray-600 mb-6">Are you sure you want to delete this schedule?</p>
                        <div className="flex justify-end gap-2">
                            <button
                                onClick={() => setShowDeleteConfirm(false)}
                                className="px-4 py-2 text-sm border rounded-lg hover:bg-gray-50"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleDelete}
                                className="px-4 py-2 text-sm bg-red-500 text-white rounded-lg hover:bg-red-600"
                            >
                                Delete
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {showTemplateListModal && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-xl p-6 w-full max-w-md">
                        <h3 className="text-lg font-semibold mb-4">Saved Templates</h3>
                        <div className="max-h-96 overflow-y-auto">
                            {templates.map((template, index) => (
                                <div key={index} className="border rounded-lg p-4 mb-4">
                                    <h4 className="font-medium mb-2">{template.name}</h4>
                                    {template.schedules.map((schedule, idx) => (
                                        <div key={idx} className="bg-gray-50 p-2 rounded mb-2">
                                            <p className="text-sm font-medium">{schedule.subject}</p>
                                            <p className="text-xs text-gray-600">
                                                {schedule.day} {schedule.startTime}-{schedule.endTime}
                                            </p>
                                        </div>
                                    ))}
                                </div>
                            ))}
                        </div>
                        <button
                            onClick={() => setShowTemplateListModal(false)}
                            className="mt-4 w-full px-4 py-2 bg-gray-100 rounded-lg hover:bg-gray-200"
                        >
                            Close
                        </button>
                    </div>
                </div>
            )}
        </div>
    );

}