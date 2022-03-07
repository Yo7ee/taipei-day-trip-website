from flask import *
import mysql.connector
import data.config as config
app=Flask(__name__)
app.config["JSON_AS_ASCII"]=False
app.config["TEMPLATES_AUTO_RELOAD"]=True

# Pages
@app.route("/")
def index():
	return render_template("index.html")
@app.route("/attraction/<id>")
def attraction(id):
	return render_template("attraction.html")
@app.route("/booking")
def booking():
	return render_template("booking.html")
@app.route("/thankyou")
def thankyou():
	return render_template("thankyou.html")

@app.route("/api/attractions/", methods=["GET"])
def page():
	#連線資料庫
	mydb=mysql.connector.connect(
		host=config.mysql["host"],
		user=config.mysql["user"],
		password=config.mysql["password"],
		database="taipeiAttraction",
	) 	
	keyword=request.args.get("keyword")

	# print(type(getData)) #資料型態list
	page=request.args.get("page", default=0) #request.args.get得到的值為str, 為了計算使用int，轉換為int	
	page=int(page)
	x=page*12
	mycursor=mydb.cursor()
	pageList=[]
	try:
		if(keyword==None):
			mycursor=mydb.cursor()
			mycursor.execute("SELECT * FROM attraction LIMIT %s,12",(x,))
			getData=mycursor.fetchall()
			if(len(getData) % 12 ==0):
				page=page+1
			else:
				page=None			
			# print(range(len(getData)))
			i=len(getData)-1
			result1={"nextPage":page,
				"Data":{
				"id":getData[i][0], 
				"name":getData[i][1],
				"category":getData[i][2],
				"description":getData[i][3],
				"address":getData[i][4],
				"transport":getData[i][5],
				"mrt":getData[i][6],
				"latitude":getData[i][7],
				"longitude":getData[i][8],
				"images":getData[i][9].split(","),#處理圖片位址str to list
				}}
			for j in range(len(getData)-2):
				result={
				"Data":{
				"id":getData[j][0], 
				"name":getData[j][1],
				"category":getData[j][2],
				"description":getData[j][3],
				"address":getData[j][4],
				"transport":getData[j][5],
				"mrt":getData[j][6],
				"latitude":getData[j][7],
				"longitude":getData[j][8],
				"images":getData[j][9].split(","),#處理圖片位址str to list
				}}
				pageList.append(result)
			pageList.append(result1)
			# pageList.update(nextPage)
			return jsonify(pageList)
		elif(type(keyword)==str):
			keyword='%'+keyword+'%' #模糊查詢結構
			mycursor=mydb.cursor()
			mycursor.execute("SELECT * FROM attraction WHERE name LIKE %s LIMIT %s,12",(keyword, x,))
			getData=mycursor.fetchall()
			if(len(getData) % 12 ==0):
				page=page+1
			else:
				page=None
			i=len(getData)-1
			result1={"nextPage":page,
				"Data":{
				"id":getData[i][0], 
				"name":getData[i][1],
				"category":getData[i][2],
				"description":getData[i][3],
				"address":getData[i][4],
				"transport":getData[i][5],
				"mrt":getData[i][6],
				"latitude":getData[i][7],
				"longitude":getData[i][8],
				"images":getData[i][9].split(","),#處理圖片位址str to list
				}}
			for j in range(len(getData-2)):
				result={
				"data":
				{"id":getData[j][0], 
				"name":getData[j][1],
				"category":getData[j][2],
				"description":getData[j][3],
				"address":getData[j][4],
				"transport":getData[j][5],
				"mrt":getData[j][6],
				"latitude":getData[j][7],
				"longitude":getData[j][8],
				"images":getData[j][9].split(","),#處理圖片位址str to list
				}}
				pageList.append(result)
			pageList.append(result1)
			return jsonify(pageList)
	except:
		errorMes={
			"error":True,
			"message":"伺服器內部錯誤"
		}
		return jsonify(errorMes)
		
@app.route("/api/attraction/<id>", methods=["GET"])
def attractionId(id):
	#連線資料庫
	mydb=mysql.connector.connect(
		host=config.mysql["host"],
		user=config.mysql["user"],
		password=config.mysql["password"],
		database="taipeiAttraction"
	) 	
	try:
		mycursor=mydb.cursor()
		mycursor.execute("SELECT * FROM attraction WHERE id= %s",(id,))
		getData=mycursor.fetchall()
		result={
			"data":{
			"id":getData[0][0], 
			"name":getData[0][1],
			"category":getData[0][2],
			"description":getData[0][3],
			"address":getData[0][4],
			"transport":getData[0][5],
			"mrt":getData[0][6],
			"latitude":getData[0][7],
			"longitude":getData[0][8],
			"images":getData[0][9].split(","),#處理圖片位址str to list
			}
		}
		return jsonify(result)
	except IndexError:
		errorMes={
			"error":True,
			"message":"景點編號錯誤"
		}
		return jsonify(errorMes)
	except:
		errorMes={
			"error":True,
			"message":"伺服器內部錯誤"
		}
		return jsonify(errorMes)

app.run(host='0.0.0.0', port=3000)