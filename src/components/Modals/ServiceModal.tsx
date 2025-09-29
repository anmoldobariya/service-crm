import Dropdown from '@/components/Dropdown';
import { FormModal } from '@/components/Modal';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import type { Service } from '@/store/api/service';
import type { RootState } from '@/store/store';
import { SERVICE_STATUS_OPTIONS } from '@/utils/constant';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  Building2,
  Plus,
  Settings,
  Trash2
} from 'lucide-react';
import React, { useEffect, useMemo } from 'react';
import { useFieldArray, useForm } from 'react-hook-form';
import { useSelector } from 'react-redux';
import * as z from 'zod';
import { DatePicker } from '../ui/date-picker';
import { IconButton } from '../ui/icon-btn';

export interface ServiceModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (serviceData: ServiceFormData) => void;
  service?: Service | null;
  loading?: boolean;
}

// Form validation schema
const machineDetailSchema = z.object({
  machine_no: z.string().optional(),
  issue: z.string().optional(),
  remark: z.string().optional(),
});

const serviceFormSchema = z.object({
  company: z.string().min(1, 'Company is required'),
  machine: z.string().min(1, 'Machine is required'),
  issue: z.string().min(1, 'Issue description is required'),
  issued_on: z.string().min(1, 'Issue date is required'),
  status: z.string().min(1, 'Status is required'),
  assigned_to: z.string().optional(),
  services: z.array(machineDetailSchema),
});

export type ServiceFormData = z.infer<typeof serviceFormSchema>;
export type MachineDetail = z.infer<typeof machineDetailSchema>;

const ServiceModal: React.FC<ServiceModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  service,
  loading = false
}) => {
  // Get options from Redux store
  const { companyOptions, userOptions, issuesOptions } = useSelector(
    (state: RootState) => state.resource
  );

  // Initialize form with react-hook-form
  const form = useForm<ServiceFormData>({
    resolver: zodResolver(serviceFormSchema),
    defaultValues: {
      company: '',
      machine: '',
      issue: '',
      issued_on: new Date().toISOString().split('T')[0],
      status: SERVICE_STATUS_OPTIONS[0].value,
      assigned_to: '',
      services: [],
    },
  });

  const { fields, append, remove } = useFieldArray<ServiceFormData>({
    control: form.control,
    name: 'services',
  });

  // Initialize form when editing or opening modal
  useEffect(() => {
    if (isOpen) {
      if (service) {
        // Reset and populate form with service data
        form.reset({
          company: service.cid?._id || '',
          machine: service.machine || '',
          issue: service.issue || '',
          issued_on: service.issued_on ? new Date(service.issued_on).toISOString().split('T')[0] : '',
          status: service.status || SERVICE_STATUS_OPTIONS[0].value,
          assigned_to: service.assigned_to?._id || '',
          services: service.services?.map(s => ({
            machine_no: s.machine_no || '',
            issue: issuesOptions.find(opt => s.issue === opt.label)?.value || '',
            remark: s.remark || ''
          })) || [],
        });
      } else {
        // Reset form for new service
        form.reset({
          company: '',
          machine: '',
          issue: '',
          issued_on: new Date().toISOString().split('T')[0],
          status: SERVICE_STATUS_OPTIONS[0].value,
          assigned_to: '',
          services: [],
        });
      }
    }
  }, [service, isOpen, issuesOptions, form]);

  // Add new machine detail
  const addServiceDetail = async () => {
    if (!(await form.trigger())) return;

    const { services } = form.getValues();
    const isValid = services.every((s) =>
      s.machine_no !== "" && s.issue !== null && s.remark?.trim() && s.remark.trim()?.length >= 15
    );

    form.clearErrors(["services"]);

    if (isValid) {
      append({
        machine_no: '',
        issue: '',
        remark: ''
      });
    } else {
      const lastIndex = services.length - 1;
      const lastService = services[lastIndex];

      if (!lastService.machine_no) {
        form.setError(`services.${lastIndex}.machine_no`, { message: 'Required Field' });
      }
      if (!lastService.issue) {
        form.setError(`services.${lastIndex}.issue`, { message: 'Required Field' });
      }
      if (!lastService.remark?.trim() || lastService.remark.trim()?.length < 15) {
        form.setError(`services.${lastIndex}.remark`, { message: 'Must have minimum 15 characters' });
      }

      setTimeout(() => {
        form.clearErrors(["services"]);
      }, 5000);
    }
  };

  // Handle form submission
  const handleSubmit = (data: ServiceFormData) => {
    if (data.services.length) {
      data.services = data.services.map(s => ({
        ...s,
        issue: issuesOptions.find(opt => s.issue === opt.value)?.label,
      }))
    }
    onSubmit(data);
  };

  // Handle cancel
  const handleCancel = () => {
    form.reset();
    onClose();
  };

  const isEditing = useMemo(() => !!service, [service]);

  return (
    <FormModal
      isOpen={isOpen}
      onClose={handleCancel}
      title={isEditing ? 'Edit Service' : 'Add Service'}
      size="xl"
      loading={loading}
      onSubmit={form.handleSubmit(handleSubmit)}
      submitText={isEditing ? 'Update' : 'Save'}
    >
      <Form {...form}>
        <div className="space-y-4 px-1">
          {/* Basic Information Section */}
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-lg font-semibold text-foreground">
              <Building2 className="h-5 w-5 text-blue-600" />
              Basic Information
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Company */}
              <FormField
                control={form.control}
                name="company"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Company *
                    </FormLabel>
                    <FormControl>
                      <Dropdown
                        placeholder="Select Company"
                        items={companyOptions}
                        value={field.value}
                        onChange={(value) => field.onChange(value as string)}
                        className="w-full h-full"
                        searchable
                        error={!!form.formState.errors.company}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Machine */}
              <FormField
                control={form.control}
                name="machine"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Machine *
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Enter Machine"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Issue Description */}
            <FormField
              control={form.control}
              name="issue"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Issue *
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Describe the issue..."
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Issue Date */}
              <FormField
                control={form.control}
                name="issued_on"
                render={() => (
                  <FormItem>
                    <FormLabel>
                      Issued On
                    </FormLabel>
                    <FormControl>
                      <DatePicker />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Status */}
              <FormField
                control={form.control}
                name="status"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Status</FormLabel>
                    <FormControl>
                      <Dropdown
                        placeholder="Select Status"
                        items={SERVICE_STATUS_OPTIONS}
                        value={field.value}
                        onChange={(value) => field.onChange(value as string)}
                        className="w-full"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Assigned To */}
              <FormField
                control={form.control}
                name="assigned_to"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Assigned To</FormLabel>
                    <FormControl>
                      <Dropdown
                        placeholder="Select Username"
                        items={userOptions}
                        value={field.value || ''}
                        onChange={(value) => field.onChange(value as string)}
                        className="w-full"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>

          {/* Machine Details Section */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-lg font-semibold text-foreground">
                <Settings className="h-5 w-5 text-blue-600" />
                Machine Details
              </div>
              <IconButton onClick={addServiceDetail} icon={<Plus className="h-4 w-4" />} size="default" variant="default" />
            </div>

            {fields.length === 0 ? (
              <Card className="border-dashed border-2 border-muted">
                <CardContent className="p-0 text-center">
                  <div className="text-muted-foreground text-sm">
                    No machine details added yet
                  </div>
                  <Button
                    type="button"
                    variant="ghost"
                    onClick={addServiceDetail}
                    className="mt-2 text-blue-600 hover:text-blue-700"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Add Machine Detail
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-3 min-h-[300px] max-h-[350px] overflow-y-auto">
                {fields.map((field, index) => (
                  <Card key={field.id} className="border border-border py-4">
                    <CardContent className="py-0 px-3 flex justify-center items-center gap-3">
                      <FormField
                        control={form.control}
                        name={`services.${index}.machine_no`}
                        render={({ field }) => (
                          <FormItem className='w-[110px]'>
                            <FormLabel className="text-sm font-medium">Machine No</FormLabel>
                            <FormControl>
                              <Input
                                placeholder="Machine No"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name={`services.${index}.issue`}
                        render={({ field }) => (
                          <FormItem className='w-[200px]'>
                            <FormLabel className="text-sm font-medium">
                              Issue
                            </FormLabel>
                            <FormControl>
                              <Dropdown
                                placeholder="Select Issue"
                                items={issuesOptions}
                                value={field.value}
                                onChange={(value) => field.onChange(value as string)}
                                className="w-full h-full"
                                searchable
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name={`services.${index}.remark`}
                        render={({ field }) => (
                          <FormItem className='flex-1 w-full'>
                            <FormLabel className="text-sm font-medium">Solution</FormLabel>
                            <FormControl>
                              <Input
                                placeholder="Enter Solution"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => remove(index)}
                        className="h-8 w-8 p-0 text-red-600 hover:text-red-700 hover:bg-red-50"
                      >
                        <IconButton className='mt-6' icon={<Trash2 className="h-4 w-4" />} size="default" variant="destructive" />
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </div>
      </Form>
    </FormModal>
  );
};

export default ServiceModal;
