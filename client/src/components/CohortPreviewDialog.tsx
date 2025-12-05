import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Calendar, Users, Building, GraduationCap, Clock, Video } from "lucide-react";
import { format } from "date-fns";

interface CohortInfo {
  id: number;
  name: string;
  startDate?: string;
  endDate?: string;
  isActive: boolean;
  sessionCount?: number;
}

interface CohortPreviewDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  personName: string;
  personRole: 'mentor' | 'student';
  cohorts: CohortInfo[];
}

export function CohortPreviewDialog({ 
  open, 
  onOpenChange, 
  personName, 
  personRole,
  cohorts 
}: CohortPreviewDialogProps) {
  const RoleIcon = personRole === 'mentor' ? Building : GraduationCap;
  const roleColor = personRole === 'mentor' ? 'text-blue-600' : 'text-green-600';
  const bgColor = personRole === 'mentor' ? 'bg-blue-100 dark:bg-blue-900/30' : 'bg-green-100 dark:bg-green-900/30';

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <div className={`p-2 rounded-full ${bgColor}`}>
              <RoleIcon className={`h-5 w-5 ${roleColor}`} />
            </div>
            <div>
              <span className="block">{personName}</span>
              <span className="text-sm font-normal text-muted-foreground capitalize">{personRole}</span>
            </div>
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-3 mt-4">
          <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
            <Users className="h-4 w-4" />
            <span>Participating in {cohorts.length} cohort{cohorts.length !== 1 ? 's' : ''}</span>
          </div>
          
          {cohorts.length === 0 ? (
            <div className="text-center py-6 text-muted-foreground">
              Not assigned to any cohorts yet.
            </div>
          ) : (
            <div className="space-y-2 max-h-64 overflow-y-auto pr-1">
              {cohorts.map((cohort) => (
                <Card key={cohort.id} className="overflow-hidden" data-testid={`cohort-preview-${cohort.id}`}>
                  <CardContent className="p-3">
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <Calendar className="h-4 w-4 text-primary-custom flex-shrink-0" />
                          <span className="font-medium truncate">{cohort.name}</span>
                        </div>
                        <div className="flex items-center gap-3 text-xs text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            {cohort.startDate 
                              ? format(new Date(cohort.startDate), 'MMM yyyy') 
                              : 'TBD'}
                            {cohort.endDate && ` - ${format(new Date(cohort.endDate), 'MMM yyyy')}`}
                          </span>
                          {cohort.sessionCount !== undefined && (
                            <span className="flex items-center gap-1">
                              <Video className="h-3 w-3" />
                              {cohort.sessionCount} sessions
                            </span>
                          )}
                        </div>
                      </div>
                      <Badge 
                        variant={cohort.isActive ? "default" : "secondary"} 
                        className="flex-shrink-0 text-xs"
                      >
                        {cohort.isActive ? "Active" : "Past"}
                      </Badge>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
