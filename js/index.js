window.addEventListener('load', function () {

    //定义一个记录点击缩略图的下标
    var bigimgIndex = 0;
    // 路径渲染函数
    navPathDataBind();
    function navPathDataBind() {
        /*
    动态渲染路径导航
    思路:
    1.先获取路径导航的页面元素
    2.再来获取所需要的数据(data.js->goodData.path)
    3.由于数据需要动态产生,那么相应的document元素也应该是动态产生的,含义:需要创建元素,根据数量多少来创建
    4.插入元素
    5.在遍历数据创建DOM元素的最后一条,只创建a标签,而不创建i标签
    */

        // 1.获取路径导航的元素对象
        var navPath = document.querySelector('#wrapper #content .contentMain #navPath');
        // 
        //2. 获取数据(data.js->goodData.path)
        var path = goodData.path;
        // console.log(path);
        // 遍历数据
        for (var i = 0; i < path.length; i++) {
            // 做判断,如果i循环到了数据最后一个
            // 就只需要创建a标签,并添加文本,不需要href属性
            if (i == path.length - 1) {
                var aNode = document.createElement('a')
                aNode.innerHTML = path[i].title;
                navPath.appendChild(aNode)
            } else {
                // 根据数据长度创建a标签
                var aNode = document.createElement('a');
                aNode.href = path[i].url;
                aNode.innerHTML = path[i].title;
                // 创建i标签(斜杠)
                var iNode = document.createElement('i');
                iNode.innerHTML = '/';
                // 将元素添加到那navPath里
                navPath.appendChild(aNode);
                navPath.appendChild(iNode);
            }



        }
    }

    //放大镜的移入移出效果
    bigClassBind();
    function bigClassBind() {
        /*
        思路:
        1.获取小图框元素对象,并设置移入事件(onmouseenter)
        2.动态创建蒙版元素和大图框和
        3.鼠标移出时隐藏蒙版和大图框(onmouseleave)
        */
        //    获取数据
        var imagessrc = goodData.imagessrc;


        var leftTop = document.querySelector('#leftTop');
        var smallPic = document.querySelector('#smallPic');
        smallPic.onmouseenter = function () {
            // 动态创建蒙版元素
            var maskDiv = document.createElement('div');
            maskDiv.className = 'mask';
            // 动态创建大图框元素
            var bigPic = document.createElement('div');
            bigPic.id = 'bigPic';
            // 创建大图片
            var BigImg = document.createElement('img');
            BigImg.src = imagessrc[bigimgIndex].b;

            // 大图框追加大图片
            bigPic.appendChild(BigImg);

            // 让小图框追加蒙版
            smallPic.appendChild(maskDiv);
            //让leftTop追加大图框
            leftTop.appendChild(bigPic);

            // 设置移动事件
            smallPic.onmouseover = function (event) {
                //  获取鼠标距离浏览器上面和坐边的距离
                var x = event.pageX - this.offsetLeft;
                var y = event.pageY - this.offsetTop;
                // console.log(x, y);
                // (2) 减去盒子高度 300的一半 是 150 就是我们mask 的最终 left 和top值了
                //  这里我们不知道盒子高度多少,所以用盒子的高度除以2
                // (3) 我们mask 移动的距离
                var maskX = x - maskDiv.offsetWidth / 2;
                var maskY = y - maskDiv.offsetHeight / 2;
                // (4) 如果x 坐标小于了0 就让他停在0 的位置
                // 遮挡层向右的最大移动距离
                var maskMax = smallPic.offsetWidth - maskDiv.offsetWidth;
                if (maskX <= 0) {
                    maskX = 0;
                } else if (maskX >= maskMax) {
                    maskX = maskMax;
                }
                if (maskY <= 0) {
                    maskY = 0;
                } else if (maskY >= maskMax) {
                    maskY = maskMax;
                }
                maskDiv.style.left = maskX + 'px';
                maskDiv.style.top = maskY + 'px';
                // 3. 大图片的移动距离 = 遮挡层移动距离 * 大图片最大移动距离 / 遮挡层的最大移动距离
                // 大图

                // 大图片最大移动距离
                var bigMax = BigImg.offsetWidth - bigPic.offsetWidth;
                // 大图片的移动距离 X Y
                var bigX = maskX * bigMax / maskMax;
                var bigY = maskY * bigMax / maskMax;
                BigImg.style.left = -bigX + 'px';
                BigImg.style.top = -bigY + 'px';
            }

            //设置移出事件,因为我们鼠标移入是动态创建,所以写在鼠标移入事件里面
            smallPic.onmouseleave = function () {
                //小图框移出蒙版元素
                smallPic.removeChild(maskDiv);
                // 大图框移除
                leftTop.removeChild(bigPic);
            }


        }
    }

    // 放大镜缩略图动态渲染
    thunbnailDate();
    function thunbnailDate() {
        /*
        思路
        1.先获取ul
        2.在获取data.js文件下的数据
        3.遍历数组,根据数组长度创建li和img
        4.让ul遍历追加
         */
        // 获取ul
        var ul = document.querySelector('#piclist ul');
        // 获取data.js里的数据
        var imagessrc = goodData.imagessrc;
        // 遍历数组
        for (var i = 0; i < imagessrc.length; i++) {
            // 创建li元素
            var newLi = document.createElement('li');
            // 创建img
            var newImg = document.createElement('img');
            newImg.src = imagessrc[i].s;
            // 追加元素
            newLi.appendChild(newImg);
            ul.appendChild(newLi);
        }
    }

    // 点击缩略图的效果
    thumbnailclick();
    function thumbnailclick() {
        /**
         * 思路:
         * 1.获取所有li,并且循环遍历点击事件
         * 2.点击缩略图需要确定其下标位置来找到对应小图路径和大图路径,替换现有src的值
         * 
         */
        //获取所有li
        var smallPic_img = document.querySelector('#smallPic img')
        var liNodes = document.querySelectorAll("#piclist ul li");
        // 获取数据
        var imagessrc = goodData.imagessrc;
        for (let i = 0; i < liNodes.length; i++) {
            // for是一个异步执行代码
            // 在页面加载完就已经执行完成了这个时候在来触发点击(在点击事件这种回调函数里面不能用,其他地方可以)
            //i已经遍历到最后一个索引号了
            //所以我们要自定义属性,定义一个下标索引
            liNodes[i].onclick = function () {
                bigimgIndex = i;
                console.log(bigimgIndex);

                // 变化小图路径
                smallPic_img.src = imagessrc[bigimgIndex].s;

            }
        }
    }


    // 点击缩略图左右按钮
    thumbnailLeftRightClick();
    function thumbnailLeftRightClick() {
        /**
         * 思路：
         * 1.先获取左右箭头按钮
         * 2.获取可视div已经ul元素和所有li元素
         * 3.计算ul一次点击走多长，一共可以走多长
         * 4.发生点击事件
         */
        // 获取箭头元素
        var prev = document.querySelector('#wrapper #content .contentMain #cnter #left #leftBottom .prev');
        var next = document.querySelector('#wrapper #content .contentMain #cnter #left #leftBottom .next');
        //获取可视的di
        var ul = document.querySelector('#piclist ul');

        var liNodes = document.querySelectorAll('#piclist ul li');

        // 计算
        var start = 0;
        // 计算一个li加每个li右边的间距,每一次点击移动两个这么长的距离
        var step = (liNodes[0].offsetWidth + 20) * 2 + 'px';

        // 计算总共可以运动的距离  ul的宽度-div可视区的宽度=li的总数-可视区域li的个数*每个li的宽度
        var endPostion = (liNodes.length - 5) * (liNodes[0].offsetWidth + 20);

        //发生事件
        prev.addEventListener('click', function () {
            start = start - step;
            if (start < 0) {
                start = 0;
            }
            ul.style.left = -start + 'px';
        });
        next.addEventListener('click', function () {
            start = start + step;
            if (start > endPostion) {
                start = endPostion;
            }
            ul.style.left = -start + 'px';
        });
    }

    // 商品详情数据的动态渲染
    rightTopData();
    function rightTopData() {
        /**
         * 思路
         * 1.查找rightTop元素
         * 2.查找data.js-》gooddeta-》goodsDetail的数据
         * 3.建立一个字符串变量，将原来的布局结构添加进去，将所对应的数据放在对应的元素上重新渲染rightTop元素
         */
        // 查找元素
        var rightTop = document.querySelector('#wrapper #content .contentMain #cnter .right .rightTop');
        // 查找数据
        var goodsDetail = goodData.goodDetail;
        //创建一个字符串变量
        //模板字符串中替换数据
        var s = `<h3>${goodsDetail.title}</h3>
                <p>${goodsDetail.recommend}</p>
                <div class="priceWrap">
                    <div class="priceTop">
                        <span>价&nbsp;&nbsp;&nbsp;&nbsp;格</span>
                        <div class="price">
                            <span>&yen;</span>
                            <p>${goodsDetail.price}</p>
                            <i>降价通知</i>
                        </div>
                        <p>
                            <span>累计评价</span>
                            <span>${goodsDetail.evaluateNum}</span>
                        </p>
                    </div>
                    <div class="priceBottom">
                        <span>促&nbsp;&nbsp;&nbsp;&nbsp;销</span>
                        <p>
                            <span>${goodsDetail.promoteSales.type}</span>
                            <span>${goodsDetail.promoteSales.content}</span>
                        </p>
                    </div>
                </div>
                <div class="support">
                    <span>支&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;持</span>
                    <p>${goodsDetail.aupport}</p>
                </div>
                <div class="address">
                    <span>配&nbsp;送&nbsp;至</span>
                    <p>${goodsDetail.address}</p>
                </div>`;

        //重新渲染rightTop元素
        rightTop.innerHTML = s;
    }

    //商品数据内容渲染
    rightBottomData();
    function rightBottomData() {
        /**
         * 思路
         * 1.获取rightBottom元素对象
         * 2.查找Data.js->goodDetail->crumbData
         * 3.由于数据是一个数组，需要遍历，有一个元素则需要有一个dl元素对象，里面包含（dt，dd）
         * 
         */

        // 获取元素对象
        var chooseWrap = document.querySelector('#wrapper #content .contentMain #cnter .right .rightBottom .chooseWrap');
        // console.log(chooseWrap);

        // 查找数据
        var crumbData = goodData.goodDetail.crumbData;
        // console.log(crumbData);

        //  循环数据
        for (var i = 0; i < crumbData.length; i++) {
            // 创建dl
            var dl = document.createElement('dl');
            // 创建dt元素对象
            var dtNode = document.createElement('dt');
            dtNode.innerHTML = crumbData[i].title;
            // dl追加dt元素
            dl.appendChild(dtNode);
            // 遍历crumbData里面data里的数据
            for (var j = 0; j < crumbData[i].data.length; j++) {
                // 创建dd
                var ddNode = document.createElement('dd');
                ddNode.innerHTML = crumbData[i].data[j].type;
                ddNode.setAttribute('price',crumbData[i].data[j].changPrice);
                // 让dl追加dd
                dl.appendChild(ddNode);
            }
            // 再把dl追加到chooseWrap里面
            chooseWrap.appendChild(dl);
        }

    }

    //点击商品参数之后的颜色排他效果
    clickddBind();
    function clickddBind() {
        /**
         * 点击商品参数之后的颜色排他思路
         * 1.获取所有dl元素,取其中第一个dl下的所有dd,先做测试
         * 2.测试完毕后再对应的dl第一行下面再嵌套一个for循环，目的再变化下标
         * 3.循环所有dd元素,并且添加点击事件
         * 4.确定实际发生事件的目标源对象,设置其颜色为红色,然后给所有的元素颜色都重置为基础颜色
         * --===============================================
         * 
         * 
         * 
         *点击dd之后产生的mark标记
         *1.首先先创建一个可以容纳点击的dd元素值的容器（数组），确定数组的起始长度,再添加一些默认值
         *2.然后再将点击的dd元素的值按照对应下标来写到数组的元素身上
         */
        //获取所有dl元素,取其中第一个dl下的所有dd,先做测试
        var dlNode = document.querySelectorAll('#wrapper #content .contentMain #cnter .right .rightBottom .chooseWrap dl');

        var arr = new Array(dlNode.length);
        arr.fill(0);       
        var choose = document.querySelector('.choose');
        
        for (var q = 0; q < dlNode.length; q++) {
            // 这里因为for循环是同步执行代码，而事件处理函数是回调函数，当我们还没触发事件，外面两层for循环就已经执行完了
            // 所以这里使用闭包函数，是立即执行函数，
            (function () {
                var ddNodes = dlNode[q].querySelectorAll('dd');
                // 遍历当前所有的dd元素
                for (var i = 0; i < ddNodes.length; i++) {
                    ddNodes[i].onclick = function () {

                        // 清空choose元素
                        choose.innerHTML = '';

                        for (var j = 0; j < ddNodes.length; j++) {
                            ddNodes[j].style.color = '#666';
                        }

                        this.style.color = 'red';

                        // 点击哪一个dd元素就把这个元素存到数组
                        arr[i] = this;

                        changPriceBind(arr);
                        // 遍历arr数组，将非0的值写入到mark标记中
                        arr.forEach(function(value,index){
                            // 只有value不等于0，就动态创建mark标签
                            if(value){
                                // 创建div并且设置id属性
                                var markDiv = document.createElement('div');
                                markDiv.id = 'mark';
                                markDiv.innerText = value.innerText;
                                //创建a标签，并设置值
                                var aNode = document.createElement('a');
                                aNode.innerText='X';
                                // 并且设置下标
                                aNode.setAttribute('index',index)
                                // 将a标签追加到div
                                markDiv.appendChild(aNode);
                                // 将div追加到choose
                                choose.appendChild(markDiv);
                            }
                            console.log(arr);
                        })
                        //获取所有的a标签，并且循环发生点击事件
                        var aNodeS = document.querySelectorAll('#wrapper #content .contentMain #cnter .right .rightBottom .choose #mark a');
                        
                        for(var n=0;n<aNodeS.length;n++){
                            aNodeS[n].onclick=function(){
                                 //获取点击的a标签上的index的值
                                 var idx1 = this.getAttribute('index');
                                 console.log(idx1);
                                //  恢复数组中对应下标元素的值
                                arr[idx1] = 0;

                                // 找到对应下标的那个dl行中的所有dd元素
                                var ddlist = dlNode[idx1].querySelectorAll('dd');

                                // 遍历所有的dd元素
                                for(var m =0;m<ddlist.length;m++){
                                    //其余所有dd颜色为灰色
                                    ddlist[m].style.color = '#666';
                                }
                                // 默认第一个dd文字颜色变成默认颜色
                                ddlist[0].style.color = 'red';

                                //删除对应下标位置的mark标记
                                choose.removeChild(this.parentNode);

                                //调用价格函数
                                changPriceBind(arr);
                            }
                        }
                    }

                }
            })();

        }
    }

    //价格变动的函数声明
    // changPriceBind(); 
    function changPriceBind(arr){
        /**
         * 思路
         * 1.获取价格的标签元素
         * 2.给每一个dd标签都设置自定义的属性,用来记录变化的价格
         * 3.遍历arr数组,将dd元素身上新变化的价格和原来的价格相加
         * 4.最后将计算的结果重新渲染到p价格标签中
         */

        //原来的价格标签
        var oldPrice = document.querySelector('#wrapper #content .contentMain #cnter .right .rightTop .priceWrap .priceTop .price p');
        // 取出默认的价格
        var price = goodData.goodDetail.price;
        //2.遍历arr数组
        for(var i= 0;i<arr.length;i++){
            if(arr[i]){
                // 数据类型强制转换
                var chamgePrice = Namber(arr[i].getAttribute('price'));
                // 最终的价格
                price +=chamgePrice;
            }
        }
        oldPrice.innerText = price;
    }


    // 右侧套餐选择价格变动功能
    choosePrice();
    function choosePrice(){
        /**
         * 思路
         * 1.先获取中间区域当中所有复选框
         * 2.遍历这些元素,取出价格和基础价格进行累加,累加的价格重新写回套餐价格里面
         */

        //获取复选框元素
        var ipts = document.querySelectorAll('#wrapper #content .contentMain .goodsDetaiWrap .rightDetail .chooseBox .listWrap .middle li input');
        // 获取左侧价格
        var leftPrice = document.querySelector('#wrapper #content .contentMain .goodsDetaiWrap .rightDetail .chooseBox .listWrap .left p');
        // 获取套餐价
        var newPrice = document.querySelector('#wrapper #content .contentMain .goodsDetaiWrap .rightDetail .chooseBox .listWrap .right i');
        // 遍历复选框
        for(var i= 0;i<ipts.length;i++){
            ipts[i].onclick = function(){
                // 获取左边基础价格$不需要,做一下截取,从第一个字符后面全都截取下来,存到新变量
                var oldPrice = leftPrice.innerText.slice(1);
                for(var j =0 ;j<ipts.length;j++){
                    if(ipts[j].checked){
                        // 新价格=将左侧的价格+现在选中的价格
                        oldPrice = Number(oldPrice) + Number(this.value);
                        console.log(oldPrice);
                    }
                }
                //3.重新把价格写回到套餐价
            newPrice.innerText = '¥' +oldPrice;
            }           
        }
    }   

    // 封装一个公共的选项卡函数
    /**
     * 思路
     * 被点击的元素
     * 被点击切换的元素
     */
    
    function Tab(tabBtns,tabConts){
        for(var i=0;i<tabBtns.length;i++){
            tabBtns[i].index = i;
            tabBtns[i].onclick = function(){
                for(var j=0;j<tabBtns.length;j++){
                    tabBtns[j].className='';
                    tabConts[j].className = '';
                }
                this.className='active'; 
                tabConts[this.index].className ='active';                 
            }
        }
    }
    // 点击左侧选项卡
    leftTab();
    function leftTab(){
        // 被点击的元素
        var h4s =document.querySelectorAll('#wrapper #content .contentMain .goodsDetaiWrap .leftAside .asideTop h4');
        // 被切换显示的元素
        var divs = document.querySelectorAll('#wrapper #content .contentMain .goodsDetaiWrap .leftAside .aslideContent>div');
        Tab(h4s,divs);
    }       
    // 点击右侧选项卡
    rightTap();
    function rightTap(){
        var lis = document.querySelectorAll('#wrapper #content .contentMain .goodsDetaiWrap .rightDetail .BottomDetail .tabBtns li');
        var divs = document.querySelectorAll('#wrapper #content .contentMain .goodsDetaiWrap .rightDetail .BottomDetail .tabContents div');
        Tab(lis,divs);
    }

    // 右侧边栏点击效果
    rightAsideBind();
    function rightAsideBind(){
        /**
         * 1.先找到按钮元素,发生点击事件
         * 2.记入一个初始状态,在点击事件的内部进行判断
         * 3.
         */
        // 找按钮元素
        var btn = document.querySelector('#wrapper .rightAside .btns');
        // 记入初始状态
        var falg = true;    //关闭
        // 找侧边栏
        var rightAside=document.querySelector('#wrapper .rightAside');
        btn.onclick=function(){
            // 判断是展开还是关闭
            if(falg){
                //展开
                falg = false;
                this.className='btns btnsOpen';
                rightAside.className = 'rightAside asideOpen'
            }else{
                // 关闭
                falg = true;
                this.className='btns btnsClose';
                rightAside.className = 'rightAside asideClose'
            }
        }
    }
});