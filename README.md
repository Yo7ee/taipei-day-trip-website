# Taipei day trip 台北一日遊

## Catalog

- [Live Demo](#live-demo)
- [Skills Structure](#skills-structure)
- [RESTful API](#restful-api)
- [Features](#features)
  - [#1 Lazy Loading & Infinite Scroll](#lazy-loading--infinite-scroll)
  - [#2 Keyword Search](#keyword-search)
  - [#3 Member System](#member-system)
  - [#4 View Attractions](#view-attractions)
  - [#5 Scheduled Route](#schduled-route)
  - [#6 Responsive Web Design](#responsive-web-design)

## Live Demo

http://3.224.188.5:3000/

**Test Account**</br>
| - | - |
|----|----|
|Account|123@gmail.com|
|Password|123|

**Credit Card for Test**</br>
| - | - |
|----|----|
|Card Number|4242 4242 4242 4242|
|Valid Date|01/23|
|CVV|123|

## Skills Structure

![Imgur](https://i.imgur.com/uVvQFKf.png)</br>
After the weekly development is completed, will sent Pull Request to the Reviewer, and after obtaining consent, the develop branch will be merged into the main branch, and the code will be synchronized to the EC2 computer update website.</br>

每週開發完成後，會向 Reviewer 發送 Pull Request，取得同意後將 develop 分支合併到 main 分支，並將程式碼同步到 EC2 的電腦更新網站。

## RESTful API

![Imgur](https://i.imgur.com/o7TuGxY.png)

The project adopts a development method that separation of front-end and back-end. Through the RESTful API, different data is obtained from the back-end according to the Request method sent by the front-end.

專案採用前後端分離的開發方式，透過 RESTful API，根據前端發送的 Request 方法，向後端取得不同的資料。

:exclamation:Developed according to the specification of RESTful API（Not involved in planning)

## Features

### :one: **Lazy Loading & Infinite Scroll**

Apply window scroll event to practice lazy loading and infinite scroll. By delaying loading, to make resource loading when needed, which reduces the loading burden of the browser and improves the user experience.

使用 window scroll event 實踐 Lazy Loading 和 Infinite Scroll。透過延遲，在需要時才載入所需資源，降低瀏覽器載入負擔，提升使用者體驗。

![Imgur](https://i.imgur.com/sw1iJvL.gif)

### :two: **Keyword Search**

User can search the attraction by insert keywords.

使用者可以使用關鍵字搜尋景點。

![Imgur](https://i.imgur.com/0N3MNjt.gif)

### :three: **Member System**

The user needs to become a member to use the function of booking itinerary and payment.

使用者需要成為會員才可以使用預約行程與付款的功能。

![Imgur](https://i.imgur.com/RXL4dc3.gif)

### :four: **View Attractions**

To click the attraction at the homepage, user can get the detail of attractions which was provided picture slide show.

點選首頁的景點圖片可以看到更多資訊，景點圖片以輪播方式呈現。

![Imgur](https://i.imgur.com/RJklZ40.gif)

### :five: **Scheduled Route**

Use TapPay to connect to a third-party cash flow system. After the credit card is successfully authenticated, the user completes the payment.

使用 TapPay 串接第三方金流系統，信用卡認證成功後，使用者完成付款。

![Imgur](https://i.imgur.com/XcvRztO.gif)

### :six: Responsive Web Design

![Imgur](https://i.imgur.com/vLACTRT.gif)
