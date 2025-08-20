import { useState } from "react";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

const JobCard = ({ job }) => {
  const [isSaved, setIsSaved] = useState(false);

  return (
    <Card className="group hover:shadow-lg transition-all duration-300 border-border hover:border-primary/20 rounded-2xl">
      {/* Header */}
      <CardHeader className="pb-2">
        <div className="flex items-start justify-between">
          <div>
            <h3 className="font-semibold text-lg text-foreground group-hover:text-primary transition-colors line-clamp-1">
              {job.title}
            </h3>
            <p className="text-sm text-muted-foreground capitalize">{job.employmentType}</p>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsSaved(!isSaved)}
            className={`${isSaved ? "text-primary" : "text-muted-foreground"} hover:text-primary`}
          >
            {isSaved ? "★" : "☆"}
          </Button>
        </div>
      </CardHeader>

      {/* Content */}
      <CardContent>
        <div className="flex items-center justify-between mb-3 text-sm text-muted-foreground">
          <span>{job.location || "Remote"}</span>
          <span>{new Date(job.postedAt).toLocaleDateString()}</span>
        </div>

        <p className="text-sm text-muted-foreground line-clamp-3 mb-3">
          {job.description}
        </p>

        {/* Skills */}
        <div className="flex flex-wrap gap-2">
          {job.skills.slice(0, 3).map((skill, idx) => (
            <Badge key={idx} variant="outline" className="text-xs">
              {skill}
            </Badge>
          ))}
          {job.skills.length > 3 && (
            <Badge variant="outline" className="text-xs">
              +{job.skills.length - 3} more
            </Badge>
          )}
        </div>
      </CardContent>

      {/* Footer */}
      <CardFooter className="pt-4">
        <div className="flex space-x-2 w-full">
          <Button variant="outline" className="flex-1" asChild>
            <a href={`/jobs/${job._id}`}>View</a>
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
};

export default JobCard;
