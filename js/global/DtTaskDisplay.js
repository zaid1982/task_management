function DtTaskDisplay () {

    this.getPriority = function (priority) {
        let color = '';
        if (priority === 'Urgent') {
            color = 'red-text';
        } else if (priority === 'High') {
            color = 'orange-text';
        } else if (priority === 'Normal') {
            color = 'blue-text';
        } else if (priority === 'Low') {
            color = 'green-text';
        } else {
            return '';
        }
        return '<span class="'+color+'">'+priority+'</span>';
    }

    this.getAssignee = function (shortName, profileImage) {
        if (shortName === '' || profileImage === '' || shortName === null || profileImage === null) {
            return '';
        }
        return '<div class="chip chip-sm m-0 z-depth-1"><img src="api/'+profileImage+'" alt="image">'+shortName+'</div>';
    }

    this.getTags = function (tagInput) {
        if (tagInput === '' || tagInput === null) {
            return '';
        }
        const tagArr = ['vm','payment','personal','coding','doc','meeting','support','cr','bugs','sales','hr','config'];
        const colorArr = ['light-blue accent-4','deep-orange darken-2','cyan accent-4','red accent-3','purple accent-3','pink accent-2','indigo accent-2','blue accent-1','blue accent-2','amber accent-4','teal accent-4','green accent-3'];
        let tagStr = '';
        const tags = tagInput.split(',');
        for (let i = 0; i < tags.length; i++) {
            const tag = tags[i];
            const color = '';
            for (let y = 0; y < tagArr.length; y++) {
                if (tag === tagArr[y]) {
                    tagStr += '<div class="chip chip-tag z-depth-1 '+colorArr[y]+' white-text">'+tag+'</div>';
                    break;
                }
            }
        }
        return tagStr;
    }

    this.getStatus = function (statusName, statusColor) {
        if (statusName === '' || statusColor === '' || statusName === null || statusColor === null) {
            return '';
        }
        return '<a class="badge '+statusColor+' z-depth-2">'+statusName+'</a>';
    }

    this.getProgress = function (progress) {
        if (progress === '' ||  progress === null) {
            return '';
        }
        return '<div class="progress md-progress mb-0 grey lighten-2 z-depth-1" style="height: 18px">' +
            '<div class="progress-bar progress-bar-striped progress-bar-animated bg-primary" role="progressbar" style="width: '+progress+'%; height: 18px" aria-valuenow="'+progress+'" aria-valuemin="0" aria-valuemax="100">'+progress+'%</div>' +
            '</div>';
    }

    this.getLateness = function (lateness) {
        if (lateness === '' ||  lateness === null || !mzValidNumeric(lateness)) {
            return '';
        }
        lateness = parseInt(lateness);
        const days = lateness < 0 ? -lateness : lateness;
        const color = lateness < 0 ? 'red darken-1' : 'teal lighten-2';
        const dayTerm = lateness === 0 || lateness === 1 ? ' day' : ' days';
        return '<a class="badge badge-pill '+color+' z-depth-1-half">'+days+' '+dayTerm+'</a>';
    }

    this.getAction = function (type, id, row) {
        if (type === 1) {
            return '<a><i class="fa-regular fa-pen-to-square fa-fade fa-lg '+id+'Edit" id="'+id+'Edit_' + row + '" data-toggle="tooltip" data-placement="top" title="Edit"></i></a>';
        } else if (type === 2) {
            return '<a><i class="fa-regular fa-pen-to-square fa-fade fa-lg '+id+'Edit mr-1" id="'+id+'Edit_' + row + '" data-toggle="tooltip" data-placement="top" title="Edit"></i></a>' +
                '<a><i class="fa-regular fa-circle-play fa-fade fa-lg '+id+'Record" id="'+id+'Record_' + row + '" data-toggle="tooltip" data-placement="top" title="Start Record"></i></a>';
        } else {
            return '';
        }
    }

    this.getTaskName = function (taskName, taskMainId) {
        if (taskName === '' ||  taskName === null) {
            return '';
        }
        if (taskMainId === '' ||  taskMainId === null) {
            return taskName;
        }
        return '<i class="fa-solid fa-folder-tree"></i> ' + taskName;
    }

    this.getRecordedTime = function (recordedTime, estimateTime) {
        if (recordedTime === '' ||  recordedTime === null) {
            return '';
        }
        let color = '';
        if (estimateTime === '' ||  estimateTime === null) {
            color = 'green-text';
        } else if (recordedTime <= estimateTime) {
            color = 'green-text';
        } else {
            color = 'red-text';
        }
        return '<span class="'+color+'">'+recordedTime+'</span>';
    }

    this.getEfficiency = function (data) {
        if (data === '' ||  data === null) {
            return '';
        }
        let color = '';
        if (data <= 0.2) {
            color = 'teal darken-4';
        } else if (data <= 0.4) {
            color = 'teal darken-3';
        } else if (data <= 0.6) {
            color = 'teal darken-2';
        } else if (data <= 0.8) {
            color = 'teal darken-1';
        } else if (data <= 1) {
            color = 'teal';
        } else if (data <= 1.2) {
            color = 'pink lighten-2';
        } else if (data <= 1.4) {
            color = 'pink lighten-1';
        } else if (data <= 1.6) {
            color = 'pink';
        } else if (data <= 1.8) {
            color = 'pink darken-1';
        } else if (data <= 2) {
            color = 'pink darken-2';
        } else if (data <= 3) {
            color = 'pink darken-3';
        } else {
            color = 'pink darken-4';
        }
        return '<a class="badge '+color+' z-depth-2">'+data+'</a>';
    }
}