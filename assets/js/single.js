
var issueContainerEl = document.querySelector('#issues-container');
var limitWarningEl = document.querySelector('#limit-warning');
var repoNameEl = document.querySelector('#repo-name')

function getRepoName() {
    // grab repo name from url query string
    var searchQuery = document.location.search;
    var repoName = searchQuery.split('=')[1];

    if (repoName){
        // show repo name 
        repoNameEl.textContent = repoName;

        getRepoIssues(repoName);
    } else {
        // redirect back to index.html
        document.location.replace('/index.html');
    }
}

function getRepoIssues(repo) {


    var apiUrl = 'https://api.github.com/repos/' + repo + '/issues?direction=asc';
    //  make a get request to url
    fetch(apiUrl).then(function (response) {
        // request successful
        if (response.ok) {
            response.json().then(function (data) {
                displayIssues(data);
                
                // check if results are paginated
                if (response.headers.get('Link')) {
                    // add element to the end that says 'repo has more than 30 issues.'
                    displayWarning(repo)
                }
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

var displayWarning = function(repo) {
    // add text to warning container
    limitWarningEl.textContent = 'To see more than 30 issues, visit ';
    // add link element to repo/issues
    var linkEl = document.createElement('a');
    var linkText = 'https://api.github.com/' + repo + '/issues';
    linkEl.textContent = linkText;
    linkEl.setAttribute('href', linkText);
    linkEl.setAttribute('target', '_blank');

    limitWarningEl.appendChild(linkEl);
}


// getRepoIssues('scottrohrig/portfolio');
// getRepoIssues('twitter/chill');
// getRepoIssues('facebook/react');

getRepoName()
