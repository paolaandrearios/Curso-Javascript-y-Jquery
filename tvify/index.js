// *utilizando js
// window.onload = function () {
//   alert('loaded')
// }

// Utilizando JQuery
// $(document).ready(function(){
//   alert('ready')
// });

// $(function(){
//   alert('ready')
// });

// // si se utiliza prototype
// $.noConflict();
// jQuery(document).ready(function($){
//   $ //jQuery
// })
// $ //prototype

// Module Dependencies

var $ = require('jquery');

$(function() {
  var $tvShowsContainer = $('#app-body').find('.tv-shows');
  
  $tvShowsContainer.on('click', 'button.like', function(ev){
    var $this = $(this);
    $this.closest('.tv-show').toggleClass('liked');
    // $this.animate({
    //   'fontSize': '30px'
    // },'fast');
  })

  function renderShows(shows) {
    $tvShowsContainer.find('.loader').remove(); 
    shows.forEach(function (show) {
      var article = template(show)

      var $article = $(article)
      $article.hide();
      $tvShowsContainer.append($article.fadeIn(1500));
    })
  }

  /**
   * submit search form
   */
  $('#app-body')
    .find('form')
    .submit(function onsubmit (ev) {
      ev.preventDefault();
      var busqueda = $(this)
        .find('input[type="text"]')
        .val();

      $tvShowsContainer.find('.tv-show').remove()
      var $loader =   $('<div class="loader">');
      $loader.appendTo($tvShowsContainer)
      $.ajax({
        url: "http://api.tvmaze.com/search/shows",
        data:{q: busqueda},
        success: function (res, textStatus, xhr) {
          $loader.remove();
          var shows = res.map(function (el){
            return el.show;
          })
          renderShows(shows);
        }
      })
    })

    var template =  function(show){
      return `<article class="tv-show">
                <div class="left img-container">
                  <img src="${show.image.medium}" alt="${show.name} logo">
                </div>
                <div class="right info">
                  <h1>${show.name}</h1>
                  <p>${show.summary}</p>
                  <button class="like">💖</button>
                </div>
              </article>`;
    }
    
    if (!localStorage.shows) {
      $.ajax('http://api.tvmaze.com/shows?page=1')
        .then(function(shows){
          $tvShowsContainer.find('.loader').remove();
          localStorage.shows = JSON.stringify(shows);
          renderShows(shows);
        })
    } else {
      renderShows(JSON.parse(localStorage.shows));
    } 
})