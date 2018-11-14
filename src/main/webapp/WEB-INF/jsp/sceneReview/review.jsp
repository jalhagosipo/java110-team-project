<%@ page language="java" contentType="text/html; charset=UTF-8"
    pageEncoding="UTF-8" trimDirectiveWhitespaces="true"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core"%>
<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
<title>moviestagram</title>
<link rel="stylesheet" href="/css/bootstrap.css">
<link rel="stylesheet" href="/css/fontawesome.css">
<link rel="stylesheet" href="/css/all.css">
<link rel="stylesheet" href="/css/report.css">
<link rel="stylesheet" href="/css/common.css">
<style>
    #movie-cover {
        width: 100%;
        height: 500px;
        background-size: cover;
        border-bottom: 1px solid #ccc;
    }
    #movie-title {
        width: 300px;
        height: 100px;
        background-color: rgba(255, 256, 255, 0.3);
        padding: 8px 10px;
        margin-top: 20px;
        margin-left: 10px;
        float: left;
        display: inline-block;
    }
    #movie-genres {
        width: 80px;
        display: inline-block;
        float: right;
        margin-top: 20px;
    }
    .genre-tag {
        border : 1px solid #00cca3;
        font-weight: bold;
        line-height: 1.8em;
        color: #00cca3;
        margin-top: 5px;
        border-radius: 20px;
        text-align: center;
        background-color: rgba(255, 256, 255, 0.2);
    }
    a.btn-pencil > img {
        width: 38px; height: 38px;
        margin-top: -8px;
    }
    
    
    /*===== range slider =====*/
    .slidecontainer {
        width: 100%;
    }
    
    .slider {
        -webkit-appearance: none;
        width: 100%;
        height: 25px;
        background: #d3d3d3;
        outline: none;
        opacity: 0.7;
        -webkit-transition: .2s;
        transition: opacity .2s;
    }
    
    .slider:hover {
        opacity: 1;
    }
    
    .slider::-webkit-slider-thumb {
        -webkit-appearance: none;
        appearance: none;
        width: 25px;
        height: 25px;
        /* background: #4CAF50; */
        background: #00cc99;
        cursor: pointer;
    }
    
    .slider::-moz-range-thumb {
        width: 25px;
        height: 25px;
        /* background: #4CAF50; */
        background: #00cc99;
        cursor: pointer;
    }
    /*========================*/
</style>
</head>
<body>

    <jsp:include page="../include/header.jsp"></jsp:include>


    <main role="main" class="container borderGray">
        
        <div class="row">
            <div class="col-12" id="movie-cover" style="background-image: url(${sceneCover.coverImg})">
                <div id="movie-content">
                    <div id="movie-title">
                        <h3><b>${tmdbMovie.title}</b>
                            <c:if test="${not empty sessionScope.loginUser}">
                            <a href="#" data-toggle="modal" data-target="#srAddModal" class="btn-pencil" ><img src="/img/btn-pencil.png"></a>
                            </c:if>
                        </h3>
                        <p>(${tmdbMovie.releaseDate})</p>
                    </div>
                    
                    <div id="movie-genres">
                        <c:forEach items="${tmdbMovie.genres}" var="genre">
                            <div class="genre-tag">${genre.name}</div>
                        </c:forEach>
                    </div>
                    
                </div>
            </div>
        </div>
        
        <span>
        ${movie.title}
        ${movie.posterPath}
        </span>
        
    <%-- <button type="button" class="btn btn-primary" data-toggle="modal"
            data-target="#reportModal">신고하기</button>
    <jsp:include page="../report/report.jsp"></jsp:include> --%>
    
    <%@ include file="addPopup.jsp" %>
    </main>

    <jsp:include page="../include/footer.jsp"></jsp:include>
    <script type="text/javascript">
    
    /* 모달 관련  */
    var $modal = $('#srAddModal').modal({show : false});
    $modal.on('hide.bs.modal', function(e) {
        $('input[name="srTitle"]').val('');
    });
    
    /* 슬라이드 관련 */
    $('#myRange').on('input', function() {
        var sec_num = parseInt(this.value, 10);
        var hours   = Math.floor(sec_num / 3600);
        var minutes = Math.floor((sec_num - (hours * 3600)) / 60);
        var seconds = sec_num - (hours * 3600) - (minutes * 60);

        if (hours   < 10) {hours   = "0"+hours;}
        if (minutes < 10) {minutes = "0"+minutes;}
        if (seconds < 10) {seconds = "0"+seconds;}
        $('#srTime').val(hours+':'+minutes+':'+seconds);
    });
    
    
    
    </script>
</body>
</html>