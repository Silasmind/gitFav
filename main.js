class GithubUser{
static search(username){
const endpoint= `http://api.github.com/users/${username}`

return fetch(endpoint)
.then(data => data.json())
.then(({login,
    name,
    public_repos,
    followers})=>({
    login,
     name, 
     public_repos,
      followers
}))}


}
class Favorites{


    constructor(primaryDoc){

        this.primaryDoc= document.querySelector(primaryDoc)
        this.load()

    }

    load()
{
    this.entries= JSON.parse(localStorage.getItem('@github-favorites:')) ||[]

}
save(){
    localStorage.setItem('@github-favorites:', JSON.stringify(this.entries))
}
async add(username){
try{

     const userExist= this.entries.find(entry=>entry.login.toLowerCase()===username)
     if(userExist){
        throw new Error('Usuário já cadastrado')
     }
    const user= await GithubUser.search(username)
    console.log(user)
    if(user.login===undefined){
        throw new Error('Usuário não encontrado')
    }
    this.entries= [user, ...this.entries]
    this.update()
    this.save()
} catch(error){
alert(error.message)
}


}

delete(user){

const filteredEntries= this.entries.filter(entry =>entry.login !== user.login)
this.entries= filteredEntries


this.update()
this.save()
}

   

}

class OutputView extends Favorites{

    constructor(primaryDoc){
        super(primaryDoc)
        this.tbody= this.primaryDoc.querySelector('table tbody')

this.update()
this.onAdd()

}
onAdd(){

    const addButton= this.primaryDoc.querySelector('.inputButton')
    window.document.onkeyup = event => {
        if(event.key === "Enter"){ 
          const { value } = this.primaryDoc.querySelector('.search input')
          this.add(value)
        }
      };

    addButton.onclick= ()=>{
const {value}= this.primaryDoc.querySelector('#inputSearch')

this.add(value)    }


}


update(){

this.removeAlltr()

  this.entries.forEach(user=> {
const row= this.creatROw()

row.querySelector('.user img').src= `https://github.com/${user.login}.png`
row.querySelector('.user img').alt=` imagem de ${user.name}`
row.querySelector('.user p').textContent= user.name
row.querySelector('.user a').href=`https://github.com/${user.login}`
row.querySelector('.user span').textContent= user.login
row.querySelector('.repositories').textContent= user.public_repos
row.querySelector('.followers').textContent= user.followers

row.querySelector('.remove').onclick= ()=>{

    const isOk= confirm('Tem certeza que quer deletar?')

    if(isOk){
        this.delete(user)  

    }
    
}
this.tbody.append(row)

})
if (this.entries.length == 0) {
    document.querySelector('.nothingHere').classList.remove('hide')
    document.querySelector('tbody').classList.add('hide')

      }else{
        document.querySelector('.nothingHere').classList.add('hide')
    document.querySelector('tbody').classList.remove('hide')

      }

}
creatROw(){
const tr= document.createElement('tr')
tr.innerHTML= ` 
<td class="user">
<img src="https://github.com/silasmind.png" alt="Foto de perfil">
<a href="https://github.com/silasmind" target=blank"
">   <p>Silas Oliveira</p>
<span>silasmind</span></a>

</td>
<td class="repositories"> 16</td>
<td class="followers"> 2</td>
<td> <button class="remove">&times;</button></td>
`

return tr
}
removeAlltr(){
    
 
this.tbody.querySelectorAll('tr').forEach( tr=>{
    tr.remove()
})

    }

 

    
}



new OutputView("#app")

document.addEventListener('keydown', event=>{

    console.log(event.key)
})