var userFormEl = document.querySelector('#user-form');
var nameInputEl = document.querySelector('#username');
var repoContainerEl = document.querySelector('#repos-container');
var repoSearchTerm = document.querySelector('#repo-search-term');
var languageButtonsEl = document.querySelector('#language-buttons');

var formSubmitHandler = function(event) {
    event.preventDefault();
    var username = nameInputEl.value.trim();
    if (username) {
        getUserRepos(username);
        nameInputEl.value = '';
    } else {
        alert('Please enter a GitHub username');
    }
};

var onLanguageButtonsClick = function(event) {
    if (event.target.matches('button')) {
        var language = event.target.dataset.language
        getFeaturedRepos(language);
    }
}

var getUserRepos = function(user) {
    // format github api url 
    var apiUrl = "https://api.github.com/users/" + user + "/repos";

    // make a request to the url
    fetch(apiUrl)
    .then(function(response) {
        if (response.ok) {
            response.json().then(function(data) {
                displayRepos(data, user);
            });
        } else {
            alert("Error: GitHub User Not Found");
        }
    })
    .catch(function(err) {
        alert("Unable to connect to GitHub");
    })
};

var getFeaturedRepos = function(language) {
    var apiUrl = 'https://api.github.com/search/repositories?q=' + language + '+is:featured&sort=help-wanted-issues';

    fetch(apiUrl).then(function(response) {
        if (response.ok) {
            response.json().then(function(data) {
                displayRepos(data.items, language);
            })
        } else {
            alert('Error: GitHub User Not Found');
        }
    });
};

var displayRepos = function(repos, searchTerm) {

    if (repos.length === 0) {
        repoContainerEl.textContent = "No Repositories Found.";
        return;
    }

    // clear content
    repoContainerEl.textContent = "";
    repoSearchTerm.textContent = searchTerm;

    // loop over repos
    for (let repo of repos) {
        
        // format repo name
        var repoName = repo.owner.login + "/" + repo.name;

        // create a anchor for each repo
        var repoEl = document.createElement('a');
        repoEl.classList = "list-item flex-row justify-space-between align-center";

        // add query parameters to link
        repoEl.setAttribute('href', './single-repo.html?repo='+ repoName );

        // create a span to hold repo name 
        var titleEl = document.createElement('span');
        titleEl.textContent = repoName;
        
        //  append to container
        repoEl.appendChild(titleEl);

        // add repo issues span
        // create status element w "flex-row align-center" class list
        var statusEl = document.createElement('span');
        statusEl.classList = "flex-row align-center"

        // check if current repo has issues
        if (repo.open_issues_count > 0) {
            statusEl.innerHTML = "<i class='fas fa-times status-icon icon-danger'></i>" + repo.open_issues_count + " issue(s)";
        } else {
            statusEl.innerHTML = "<i class='fas fa-check-square status-icon icon-success'></i>";
        }
        // append to container
        repoEl.appendChild(statusEl);
        
        // append container to dom
        repoContainerEl.appendChild(repoEl);
    }
}

userFormEl.addEventListener('submit', formSubmitHandler);
languageButtonsEl.addEventListener('click', onLanguageButtonsClick)