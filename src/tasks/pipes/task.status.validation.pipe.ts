import { PipeTransform, ArgumentMetadata, BadRequestException } from "@nestjs/common";
import { TaskStatus } from "../task.status.enum";

export class TaskStatusValidationPipe implements PipeTransform {
    readonly allowStatuses = [
        TaskStatus.OPEN,
        TaskStatus.IN_PROGRESS,
        TaskStatus.DONE
    ]
    transform(value: any, metadata: ArgumentMetadata) {
        if (value && value.status) {
            value.status = value.status.toUpperCase();
            if (!this.isStatusValid(value.status)) {
                throw new BadRequestException(`${value.status} is an invalid status`);
            }
        }
        return value;
    }

    private isStatusValid(status) {
        return this.allowStatuses.includes(status);
    }

}