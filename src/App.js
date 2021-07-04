import './App.css';
import './nicepage.css'


import {useState} from 'react';

function App() {

  const [gitLink, setGitLink] = useState('');
  const [repos, setRepos] = useState([]);
  const [repoCount, setRepoCount] = useState('');
  const [git_user, setGit_user] = useState('');
  const [repoDetail, setRepoDetail] = useState([]);
  const [hideModal, setHideModal] = useState(true);

  const github_data = {
    "token": "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",
    "username": "FaisalFeroze115"
  }

  const baseUrl = "https://api.github.com/graphql";
  const headers = {
    "Content-Type": "application/json",
    'Authorization': `bearer ${github_data.token}`
  }

  

  const getData = async () =>{
    const arr = gitLink.split('/');
    const last = arr[arr.length-1] || arr[arr.length-2];
    setGit_user(last);

    if(!gitLink){
      alert("Please Provide a Git Link");
      return;
    }

    const body = {
      "query":`
        query { 
          user(login: "${last}"){
          repositories(last: 100){
            totalCount
            nodes{
              name
              stargazerCount
            }
          }
        }
        }
      `
    }
  
    
  
    const res = await fetch(baseUrl,{
      method: "POST",
      headers: headers,
      body: JSON.stringify(body)
    });

    const result = await res.json();
    //console.log(result.data)
    
    setRepoCount(result.data.user.repositories.totalCount);
    setRepos(result.data.user.repositories.nodes);
    console.log(repos)
    
    // result.data.user.repositories.nodes
    // result.data.user.repositories.totalCount
    
  }

  const getDetailInfo = async (userName, repoName, repoStar) => {
      console.log(userName);
      console.log(repoName)

      const body = {
        "query":`
          query { 
            repository(owner:"${userName}", name:"${repoName}") {
              object(expression:"master") {
                ... on Commit {
                  history {
                    totalCount
                  }
                }
              }
            }
          }
        `
      }
    
      const res = await fetch(baseUrl,{
        method: "POST",
        headers: headers,
        body: JSON.stringify(body)
      });
      const result = await res.json();
      console.log(result);
      //result.data.repository.object.history.totalCount
      if(result.data.repository.object){

        setRepoDetail({
          name: repoName,
          starCount: repoStar,
          commitCount: result.data.repository.object.history.totalCount
        })
        
      }else{

        setRepoDetail({
          name: repoName,
          starCount: repoStar,
          commitCount: "0"
        })
      }

      setHideModal(false);
      console.log('repo detail',repoDetail);


  }

  return (
    <div className="App u-body">

      <section className="u-clearfix u-section-1" id="sec-8bf7">
      <div className="u-clearfix u-grey-75 u-layout-wrap u-layout-wrap-1">
        <div className="u-layout">
          <div className="u-layout-row">
            <div className="u-container-style u-layout-cell u-palette-5-dark-1 u-size-4 u-layout-cell-1">
              <div className="u-container-layout u-container-layout-1">
                <img className="u-image u-image-default u-preserve-proportions u-image-1" src="images/new_task_24dp2x.png" alt="" data-image-width="48" data-image-height="48" />
                <img className="u-image u-image-default u-preserve-proportions u-image-2" src="images/notifications_24dp2x.png" alt="" data-image-width="48" data-image-height="48" />
                <img className="u-image u-image-default u-preserve-proportions u-image-3" src="images/home_48dp2x.png" alt="" data-image-width="96" data-image-height="96" />
                <img className="u-image u-image-default u-preserve-proportions u-image-4" src="images/search_24dp2x.png" alt="" data-image-width="48" data-image-height="48" />
                <img className="u-image u-image-default u-preserve-proportions u-image-5" src="images/user_48dp2x.png" alt="" data-image-width="96" data-image-height="96" />
              </div>
            </div>
            <div className="u-container-style u-layout-cell u-palette-5-dark-3 u-size-56 u-layout-cell-2">
              <div className="u-container-layout u-container-layout-2">
                
              <div className="repo_container">
                  <p>Repos: {repoCount ? repoCount : null}</p>
                  {
                    
                    repos ? 
                    repos.map(repo=>{
                      //repo.name repo.stargazerCount
                      return(
                        // <div>
                        //   <p>{repo.name}</p>
                        //   <p>{repo.stargazerCount}</p>
                        // </div>
                        <div className="repo">
                            <span style={{cursor: "pointer"}} onClick={()=>{getDetailInfo(git_user, repo.name, repo.stargazerCount)}}>Repo Name: {repo.name} </span>
                        </div>
                        
                      )
                    })
                    : null
                    
                  
                  }
                  
              </div>
                

                <div className="u-palette-4-light-3 u-radius-45 u-shape u-shape-round u-shape-5"></div>

                <div className="u-custom-font u-font-montserrat u-text u-text-palette-5-dark-2 u-text-9">
                  <input 
                    type="text" placeholder="Enter Github page link"
                    value={gitLink}
                    onChange={(e)=>{setGitLink(e.target.value)}}
                    />
                    
                </div>
                
                <button onClick={getData} className="u-btn u-button-style u-none u-text-hover-palette-2-base u-text-palette-1-base u-btn-1">
                  <span className="u-text-palette-4-light-1">Find repos now&nbsp;</span>
                  <span className="u-text-palette-4-light-1"></span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <div onClick={()=>{setHideModal(true)}} className="card_modal" style={hideModal ? {visibility: 'hidden'} : {visibility: 'visible'}}>
        <section onClick={()=>{setHideModal(true)}} className="u-clearfix u-palette-5-dark-1 u-section-1" id="sec-466f">
            <div className="repo_modal_container">
                <h2>Repo Name: {repoDetail.name}</h2>
                <h2>No of Stars: {repoDetail.starCount}</h2>
                <h2>Total No of Commits: {repoDetail.commitCount}</h2>
            </div>
        </section>
    </div>
    
   
    </div>
  );
}

export default App;
