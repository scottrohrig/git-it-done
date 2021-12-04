
var issueContainerEl = document.querySelector('#issues-container');

function getRepoIssues(repo) {
    var apiUrl = 'https://api.github.com/repos/' + repo + '/issues?direction=asc';

    fetch(apiUrl).then(function (response) {
        if (response.ok) {
            response.json().then(function (data) {
                displayIssues(data);
            });
        }
        else {
            alert('Issue with URL request.');
        }
    });
};

var displayIssues = function(issues) {

    if (!issues.length) {
        issueContainerEl.textContent = 'This repo has no issues!';
        return;
    }

    // loop thru response data 'issues' and create <a> for each
    issues.forEach(function(issue) {
        // create <a> to take user to issue on GH
        var issueEl = document.createElement('a');
        issueEl.classList = 'list-item flex-row justify-space-between align-center';
        issueEl.setAttribute('href', issue.html_url);
        issueEl.setAttribute('target', '_blank');

        var titleEl = document.createElement('span');
        titleEl.textContent = issue.title;

        issueEl.appendChild(titleEl);

        var typeEl = document.createElement('span');

        if (issue.pull_request) {
            typeEl.textContent = '(Pull request)';
        } else {
            typeEl.textContent = '(Issue)';
        }

        issueEl.appendChild(typeEl);
        issueContainerEl.appendChild(issueEl);
    });
};

getRepoIssues('scottrohrig/portfolio');
getRepoIssues('twitter/chill');