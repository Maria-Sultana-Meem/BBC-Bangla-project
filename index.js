
 const categoryContainer=document.getElementById('category-container')
const newsContainer=document.getElementById('news-container')
const bookmarkContainer = document.getElementById('bookmark-container')
let bookmarks = []
const bookmarkCount=document.getElementById('bookmark-count')
const modalContainer=document.getElementById('modal-container')
const newsDetailsModal=document.getElementById('news_details_modal')

const loadCategory=()=>{

fetch('https://news-api-fs.vercel.app/api/categories')
.then((res)=>res.json())
.then((data)=>{
const categories = data.categories;
showCategory(categories)
})
.catch((err)=>{
    console.log(err);
    
})
};


const showCategory=(categories)=>{

categories.forEach(cat=>{
   categoryContainer.innerHTML+=`
      <li id="${cat.id}" class="hover:border-b-4 hover:border-red-700 border-red-700 cursor-pointer">${cat.title}</li>
   
   `  
})

categoryContainer.addEventListener('click',(e)=>{

const allLi = document.querySelectorAll('li')
allLi.forEach(li=>{
    li.classList.remove('border-b-4')
})
    if (e.target.localName==='li') {
        showLoading()
    e.target.classList.add('border-b-4')
    loadNewsByCategory(e.target.id)
}

})

};

const loadNewsByCategory=(categoryId)=>{

fetch(`https://news-api-fs.vercel.app/api/categories/${categoryId}`)
.then((res)=>res.json())
.then((data)=>{
    showNewsBycategory(data.articles);
    
})
.catch(err=>{
    showError()
    
})
}

const showNewsBycategory=(articles)=>{

newsContainer.innerHTML=''
    articles.forEach(article=>{
newsContainer.innerHTML += `
<div class = "border border-gray-300 rounded-lg">
   <div>
    <img src="${article.image.srcset[0].url}" alt="">
   </div> 
  <div id="${article.id}" class="p-2">
   <h1 class= "font-extrabold"> ${article.title}</h1>
  <p class="text-sm">${article.time}</p>
  <button class = "btn">Bookmark</button>
  <button class = "btn">View Details</button>

  </div>
</div>

`

})



}

newsContainer.addEventListener('click',(e)=>{
if (e.target.innerText==='Bookmark') {
    handleBookMarks(e)

}
if (e.target.innerText==='View Details') {
    handleViewDetails(e)

}

})

const handleBookMarks=(e)=>{

    const title = e.target.parentNode.children[0].innerText;
    const id =e.target.parentNode.id
  bookmarks.push({
    title:title,
    id:id
  })
  showBookMarks(bookmarks)
  
}

const showBookMarks=(bookmarks)=>{
   bookmarkContainer.innerHTML=''
    bookmarks.forEach(bookmark=>{
    bookmarkContainer.innerHTML +=`
    <div class="border my-2 p-1">
    <h1>${bookmark.title}</h1>
    <button onclick="handleDeleteBookmark('${bookmark.id}')" class="btn btn-xs">delete</button>
    </div>
    
    `
})
bookmarkCount.innerText=bookmarks.length
}

const handleDeleteBookmark=(bookmarkId)=>{
const filteredBookmarks=bookmarks.filter(bookmark=>bookmark.id !==bookmarkId)
bookmarks=filteredBookmarks
showBookMarks(bookmarks)
}

const showLoading=()=>{
    newsContainer.innerHTML=`
    <div class="bg-green-500 p-3">Loading......</div>
    `
}

const showError=()=>{
   newsContainer.innerHTML=`
    <div class="bg-red-700 p-3">Something went wrong</div>
    `

}

const  handleViewDetails=(e)=>{
   const id = e.target.parentNode.id 
  fetch(`https://news-api-fs.vercel.app/api/news/${id}`)
.then((res)=>res.json())
.then((data)=>{
showDetailsNews(data.articles)

})
.catch(err=>{
    console.log(err);
    
})
   
}
const showDetailsNews=(article)=>{
newsDetailsModal.showModal()
modalContainer.innerHTML=`
<h1>${article.title}</h1>
 <img src="${article.images[0].url}" alt="">
  <p>${article.content.join("")}</p> 
`
}

loadCategory()
loadNewsByCategory('main')