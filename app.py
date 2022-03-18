from flask import *
import mysql.connector
import data.config as config
#For coonnection pool
from mysql.connector import pooling
pool=pooling.MySQLConnectionPool

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

#connect pooling
connectionPool=pool(
	pool_name="mysqlpool",
	pool_size=10,
	pool_reset_session=True,#reset session varialbes when the connection is returned to the pool
	host=config.mysql["host"],
	user=config.mysql["user"],
	password=config.mysql["password"],
	database="taipeiAttraction",
	)


@app.route("/api/attractions/", methods=["GET"])
def page():
	#連線資料庫
	# mydb=mysql.connector.connect(
	# 	host=config.mysql["host"],
	# 	user=config.mysql["user"],
	# 	password=config.mysql["password"],
	# 	database="taipeiAttraction",
	# )
	mydb=connectionPool.get_connection()
	keyword=request.args.get("keyword")
	# print(type(getData)) #資料型態list
	page=request.args.get("page") #request.args.get得到的值為str, 為了計算使用int，轉換為int	
	page=int(page)
	x=page*12
	mycursor=mydb.cursor()
	pageList=[]
	try:
		if(keyword==None):
			mycursor=mydb.cursor()
			mycursor.execute("SELECT * FROM attraction LIMIT %s,12",(x,))
			getData=mycursor.fetchall()
			if(len(getData) % 12 ==0 and len(getData)!=0): #當資料小於12或是沒有資料時，nextPage=null
				page=page+1
			else:
				page=None			
			# print(range(len(getData)))
			for j in range(len(getData)):
				result={
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
				}
				pageList.append(result)
			result={"nextPage":page,"data":pageList}
			return jsonify(result)
		elif(type(keyword)==str):
			keyword='%'+keyword+'%' #模糊查詢結構
			mycursor=mydb.cursor()
			mycursor.execute("SELECT * FROM attraction WHERE name LIKE %s LIMIT %s,12",(keyword, x,))
			getData=mycursor.fetchall()
			if(len(getData) % 12 ==0 and len(getData)!=0):
				page=page+1
			else:
				page=None
			for j in range(len(getData)):
				result={
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
				}
				pageList.append(result)
			result={"nextPage":page,"data":pageList}
			return jsonify(result)
	except:
		errorMes={
			"error":True,
			"message":"伺服器內部錯誤"
		}
		return jsonify(errorMes)
	finally:
		if mydb.is_connected():
			mycursor.close()
			mydb.close()
			print("mybd connection is closed")

@app.route("/api/attraction/<id>", methods=["GET"])
def attractionId(id):
	#連線資料庫
	# mydb=mysql.connector.connect(
	# 	host=config.mysql["host"],
	# 	user=config.mysql["user"],
	# 	password=config.mysql["password"],
	# 	database="taipeiAttraction"
	# )
	mydb=connectionPool.get_connection() 	
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
	finally:
		if mydb.is_connected():
			mycursor.close()
			mydb.close()
			print("mybd connection is closed")

app.run(host='0.0.0.0', port=3000, debug=True)