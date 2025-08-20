import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MapPin, Clock, DollarSign, Building2, Bookmark } from "lucide-react";

function JobCard({ job }) {
  const [isSaved, setIsSaved] = useState(false);

  return (
    <Card className="group hover:shadow-lg transition-all duration-300 border-border hover:border-primary/20 bg-gradient-card">
      <CardHeader className="pb-4">
        <div className="flex items-start justify-between">
          <div className="flex items-start space-x-4">
            <div className="w-12 h-12 bg-gradient-primary rounded-lg flex items-center justify-center flex-shrink-0">
              {job.companyLogo ? (
                <img
                  src={job.companyLogo}
                  alt={job.company}
                  className="w-8 h-8 rounded"
                />
              ) : (
                <Building2 className="w-6 h-6 text-primary-foreground" />
              )}
            </div>
            <div className="min-w-0 flex-1">
              <h3 className="font-semibold text-lg text-foreground group-hover:text-primary transition-colors line-clamp-2">
                {job.title}
              </h3>
              <p className="text-muted-foreground font-medium">{job.company}</p>
              <div className="flex items-center space-x-4 mt-2 text-sm text-muted-foreground">
                <div className="flex items-center">
                  <MapPin className="w-4 h-4 mr-1" />
                  {job.location}
                </div>
                <div className="flex items-center">
                  <Clock className="w-4 h-4 mr-1" />
                  {new Date(job.createdAt).toLocaleDateString()}
                </div>
              </div>
            </div>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsSaved(!isSaved)}
            className={`${
              isSaved ? "text-accent" : "text-muted-foreground"
            } hover:text-accent`}
          >
            <Bookmark className={`w-4 h-4 ${isSaved ? "fill-current" : ""}`} />
          </Button>
        </div>
      </CardHeader>

      <CardContent className="pt-0">
        <div className="flex items-center space-x-4 mb-4">
          {job.type && (
            <Badge variant="secondary" className="text-xs">
              {job.type}
            </Badge>
          )}
          {job.salary && (
            <div className="flex items-center text-sm font-medium text-foreground">
              <DollarSign className="w-4 h-4 mr-1" />
              {job.salary}
            </div>
          )}
        </div>

        <p className="text-muted-foreground text-sm line-clamp-3 mb-4">
          {job.description}
        </p>

        <div className="flex flex-wrap gap-2">
          {job.tags?.slice(0, 3).map((tag, index) => (
            <Badge key={index} variant="outline" className="text-xs">
              {tag}
            </Badge>
          ))}
          {job.tags?.length > 3 && (
            <Badge variant="outline" className="text-xs">
              +{job.tags.length - 3} more
            </Badge>
          )}
        </div>
      </CardContent>

      <CardFooter className="pt-4">
        <div className="flex space-x-2 w-full">
          <Button
            variant="outline"
            className="flex-1"
            onClick={() => (window.location.href = `/jobs/${job._id}`)}
          >
            View Details
          </Button>
          <Button className="flex-1">Apply Now</Button>
        </div>
      </CardFooter>
    </Card>
  );
}

export default JobCard;
