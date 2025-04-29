import os
from dotenv import load_dotenv
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
import openai
from supabase import create_client, Client
from fastapi import Query
from typing import Dict, List
from fastapi.middleware.cors import CORSMiddleware
import pandas as pd
from sklearn.ensemble import IsolationForest
from sklearn.preprocessing import StandardScaler
import os


# Load environment variables
load_dotenv()
openai.api_key = os.getenv("OPENAI_API_KEY")
SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_KEY = os.getenv("SUPABASE_KEY")

# Initialize FastAPI and Supabase client
app = FastAPI()
supabase = create_client(SUPABASE_URL, SUPABASE_KEY)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Replace with your frontend domain(s)
    allow_credentials=True,
    allow_methods=["*"],  # Allow all methods
    allow_headers=["*"],  # Allow all headers
)

# Define the input model for API
class QueryRequest(BaseModel):
    user_query: str
    output_type: str

# Helper function to generate SQL query using LLM
def generate_sql_query(user_query: str) -> str:
    prompt = f"""
    Convert the following natural language query into an SQL string:
    Query: "{user_query}"
    Database structure:

    Table 1 - patient: Columns (patient_id: int4, name: varchar, age: int4, length_of_stay: int4, gender: text, transgender_identity: text, sexual_orientation: text, race_or_ethnicity: text, diagnosis: text, patient_notes: text, dialogue: text, treatment: text)
    
    SQL Query string:
    """
    
    # Update for chat-based interaction with gpt-3.5-turbo
    response = openai.ChatCompletion.create(
        model="gpt-3.5-turbo",
        messages=[
            {"role": "system", "content": "You are an SQL expert."},
            {"role": "user", "content": prompt}
        ],
        max_tokens=100,
        temperature=0
    )
    
    sql_query = response.choices[0].message['content'].strip()
    return sql_query

def generate_text_output(data, sql_query: str, user_query: str) -> str:
    prompt = f"""
    Given the following data returned from the following sql query and following user query, give a short summary of the data:
    Data: "{data}"
    SQL_query: "{sql_query}"
    User_query: "{user_query}"
    
    Text Summarization:
    """
    
    # Update for chat-based interaction with gpt-3.5-turbo
    response = openai.ChatCompletion.create(
        model="gpt-3.5-turbo",
        messages=[
            {"role": "user", "content": prompt}
        ],
        max_tokens=100,
        temperature=0
    )
    
    output = response.choices[0].message['content'].strip()
    return output

def generate_graph_output(user_query: str, data) -> str:
    return 'This feature is in development'


# API Endpoint
@app.post("/query")  # Changed to POST here
async def query_database(data: Dict):
    # Debugging line to confirm received query
    print(f"Received user query: {data["user_query"]}")
    print(f"Requested output type: {data["format"]}")

    if data['format'] == 'graph':
        return generate_graph_output(data["user_query"], data)
    
    # Step 1: Generate SQL query
    try:
        sql_query = generate_sql_query(data["user_query"])
        print(f"Generated SQL Query: {sql_query}")
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error generating SQL query: {e}")

    # Step 2: Query Supabase database
    try:
        result = supabase.rpc("exec_sql", {'sql_query': sql_query}).execute()
        
        # Choose the output type based on user's request
        if data["format"] == "text":
            return generate_text_output(data["user_query"], sql_query, result.data)
        elif data["format"] == "table":
            return result.data
        elif data["format"] == "graph":
            print(result.data)
            return generate_graph_output(data["user_query"], result.data)
        else:
            raise HTTPException(status_code=400, detail="Invalid output type specified")
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Database query error: {e}")
    

# Function to fetch data from Supabase
def fetch_data(query: str) -> pd.DataFrame:
   result = supabase.rpc("exec_sql", {"sql_query": query}).execute()
   return pd.DataFrame(result.data) if result.data else pd.DataFrame()


# Anomaly detection function
def detect_anomalies():
   # Fetch data from Supabase
   revenue_df = fetch_data("SELECT * FROM Revenue")
   expenses_df = fetch_data("SELECT * FROM Expenses")


   # Preprocess data
   for df in [revenue_df, expenses_df]:
       df['date'] = pd.to_datetime(df['date'])
       df['timestamp'] = df['date'].astype('int64') // 10**9  # Convert date to UNIX timestamp in seconds


   # Run anomaly detection for Revenue
   revenue_features = revenue_df[['amount', 'timestamp']]
   scaler_revenue = StandardScaler()
   revenue_features_scaled = scaler_revenue.fit_transform(revenue_features)
   isolation_forest_low = IsolationForest(contamination=0.01, random_state=42)
   revenue_df['anomaly'] = isolation_forest_low.fit_predict(revenue_features_scaled)
   revenue_anomalies = revenue_df[(revenue_df['anomaly'] == -1) & (revenue_df['amount'] < revenue_df['amount'].median())]


   # Run anomaly detection for Expenses
   expenses_features = expenses_df[['amount', 'timestamp']]
   scaler_expenses = StandardScaler()
   expenses_features_scaled = scaler_expenses.fit_transform(expenses_features)
   isolation_forest_high = IsolationForest(contamination=0.01, random_state=42)
   expenses_df['anomaly'] = isolation_forest_high.fit_predict(expenses_features_scaled)
   expenses_anomalies = expenses_df[(expenses_df['anomaly'] == -1) & (expenses_df['amount'] > expenses_df['amount'].median())]


   # Return anomalies as JSON
   return {
       "revenue_anomalies": revenue_anomalies[['id', 'date', 'amount']].to_dict(orient="records"),
       "expenses_anomalies": expenses_anomalies[['id', 'date', 'amount']].to_dict(orient="records")
   }


# Endpoint to get anomalies
@app.get("/detect_anomalies")
def get_anomalies():
   anomalies = detect_anomalies()
   return anomalies


class num_clients(BaseModel):
    number_of_patients: int

# Endpoint to fetch the number of patients
@app.get("/num_clients", response_model=num_clients)
async def get_num_clients():
    try:
        # Query to fetch the number of patients from 'patient' table
        sql_query = """
            SELECT COUNT(patient_id) AS number_of_patients
            FROM public.patient
        """
        response = supabase.rpc("exec_sql", {"sql_query": sql_query}).execute()

        # Check if data exists
        if not response.data or "number_of_patients" not in response.data[0]:
            raise HTTPException(status_code=404, detail="No data found in 'patient' table")
        
        # Return response data in expected model format
        return num_clients(number_of_patients=response.data[0]["number_of_patients"])

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    
class intakes(BaseModel):
    total_intakes: int
    intakes_within_72_hours: int
    intakes_within_30_days: int

# Endpoint to fetch the number of intakes
@app.get("/intakes", response_model=intakes)
async def get_intakes():
    try:
        # Query to fetch the number of intakes from 'intakes' table
        sql_query = """
            SELECT
                COUNT(*) AS total_intakes,
                SUM(
                    CASE
                        WHEN readmission_within_72 = 1 THEN 1
                        ELSE 0
                    END
                ) AS intakes_within_72_hours,
                SUM(
                    CASE
                        WHEN readmission_within_30 = 1 THEN 1
                        ELSE 0
                    END
                ) AS intakes_within_30_days
            FROM
                public.intakes
        """
        response = supabase.rpc("exec_sql", {"sql_query": sql_query}).execute()

        # Check if data exists
        if not response.data or "total_intakes" not in response.data[0]:
            raise HTTPException(status_code=404, detail="No data found in 'intakes' table")
        
        # Return response data in expected model format
        return intakes(
            total_intakes=response.data[0]["total_intakes"],
            intakes_within_72_hours=response.data[0]["intakes_within_72_hours"],
            intakes_within_30_days=response.data[0]["intakes_within_30_days"]
        )

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    

class discharges(BaseModel):
    total_discharges: int
    discharges_hospital: int
    discharges_higher_level: int
    discharges_home_community: int
    discharges_undesirable_circumstances: int
    discharges_unknown: int

# Endpoint to fetch the number of discharges
@app.get("/discharges", response_model=discharges)
async def get_discharges():
    try:
        # Query to fetch the number of discharges from 'discharges' table
        sql_query = """
           SELECT
  COUNT(*) AS total_discharges,
  SUM(
    CASE
      WHEN last_service_used = 'hospital' THEN 1
      ELSE 0
    END
  ) AS discharges_hospital,
  SUM(
    CASE
      WHEN last_service_used = 'higher level' THEN 1
      ELSE 0
    END
  ) AS discharges_higher_level,
  SUM(
    CASE
      WHEN last_service_used = 'home community' THEN 1
      ELSE 0
    END
  ) AS discharges_home_community,
  SUM(
    CASE
      WHEN last_service_used = 'undesirable circumstances' THEN 1
      ELSE 0
    END
  ) AS discharges_undesirable_circumstances,
  SUM(
    CASE
      WHEN last_service_used = 'unknown' THEN 1
      ELSE 0
    END
  ) AS discharges_unknown
FROM
  public.discharges
        """
        response = supabase.rpc("exec_sql", {"sql_query": sql_query}).execute()

        # Check if data exists
        if not response.data or "total_discharges" not in response.data[0]:
            raise HTTPException(status_code=404, detail="No data found in 'discharges' table")
        
        # Return response data in expected model format
        return discharges(
            total_discharges=response.data[0]["total_discharges"],
            discharges_hospital=response.data[0]["discharges_hospital"],
            discharges_higher_level=response.data[0]["discharges_higher_level"],
            discharges_home_community=response.data[0]["discharges_home_community"],
            discharges_undesirable_circumstances=response.data[0]["discharges_undesirable_circumstances"],
            discharges_unknown=response.data[0]["discharges_unknown"]
        )

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    




# Define a model for the average length of stay response
class AverageLengthOfStayResponse(BaseModel):
    average_length_of_stay: float

# Endpoint to fetch average length of stay data
@app.get("/average_length_of_stay", response_model=AverageLengthOfStayResponse)
async def get_average_length_of_stay():
    try:
        # Query to fetch average length of stay from 'patient' table
        sql_query = "SELECT AVG(length_of_stay) AS average_length_of_stay FROM public.patient;"
        response = supabase.rpc("exec_sql", {"sql_query": sql_query}).execute()

        # Check if data exists
        if not response.data or "average_length_of_stay" not in response.data[0]:
            raise HTTPException(status_code=404, detail="No data found in 'patient' table")
        
        # Return response data in expected model format
        return AverageLengthOfStayResponse(average_length_of_stay=response.data[0]["average_length_of_stay"])

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


# Endpoint to fetch discharge data by gender
class GenderDischarge(BaseModel):
    gender: str
    discharge_count: int
    total_higher_level: int
    total_home_community: int
    total_hospital: int
    total_undesirable_circumstances: int
    total: int

@app.get("/gender_discharge", response_model=List[GenderDischarge])
async def get_gender_discharge():
    try:
        sql_query = """
        SELECT
          COALESCE(p.gender, 'total') AS gender,
          COUNT(d.patient_id) AS discharge_count,
          SUM(d.higher_level) AS total_higher_level,
          SUM(d.home_community) AS total_home_community,
          SUM(d.hospital) AS total_hospital,
          SUM(d.undesirable_circumstances) AS total_undesirable_circumstances,
          COUNT(d.patient_id) AS total
        FROM
          public.patient p
          JOIN public.discharges d ON p.patient_id = d.patient_id
        GROUP BY
          ROLLUP (p.gender)
        ORDER BY
          p.gender
        """
        
        response = supabase.rpc("exec_sql", {"sql_query": sql_query}).execute()

        return response.data
    



    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    
class TransgenderDischarge(BaseModel):
    transgender_identity: str
    discharge_count: int
    total_higher_level: int
    total_home_community: int
    total_hospital: int
    total_undesirable_circumstances: int

@app.get("/transgender_discharge", response_model=List[TransgenderDischarge])
async def get_Transgender_discharge():

      try:
        sql_query = """
       SELECT
            COALESCE(p.transgender_identity, 'total') AS transgender_identity,
            COUNT(d.patient_id) AS discharge_count,
            SUM(d.higher_level) AS total_higher_level,
            SUM(d.home_community) AS total_home_community,
            SUM(d.hospital) AS total_hospital,
            SUM(d.undesirable_circumstances) AS total_undesirable_circumstances
      FROM
            public.patient p
      JOIN public.discharges d ON p.patient_id = d.patient_id
      GROUP BY
            ROLLUP (p.transgender_identity)
      ORDER BY
            p.transgender_identity
        """
        
        response = supabase.rpc("exec_sql", {"sql_query": sql_query}).execute()

        return response.data
    



      except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
      

class Sexual_Orienatation_Discharge(BaseModel):
    sexual_orientation: str
    discharge_count: int
    total_higher_level: int
    total_home_community: int
    total_hospital: int
    total_undesirable_circumstances: int

@app.get("/sexual_orientation_discharge", response_model=List[Sexual_Orienatation_Discharge])
async def get_sexual_orientation_discharge():

      try:
        sql_query = """
      SELECT
            COALESCE(p.sexual_orientation, 'total') AS sexual_orientation,
            COUNT(d.patient_id) AS discharge_count,
            SUM(d.higher_level) AS total_higher_level,
            SUM(d.home_community) AS total_home_community,
            SUM(d.hospital) AS total_hospital,
            SUM(d.undesirable_circumstances) AS total_undesirable_circumstances
      FROM
            public.patient p
      JOIN public.discharges d ON p.patient_id = d.patient_id
      GROUP BY
            ROLLUP (p.sexual_orientation)
      ORDER BY
            p.sexual_orientation
        """
        
        response = supabase.rpc("exec_sql", {"sql_query": sql_query}).execute()

        return response.data
    



      except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
      

class Race_Ethnicity_Discharge(BaseModel):
    race_or_ethnicity: str
    discharge_count: int
    total_higher_level: int
    total_home_community: int
    total_hospital: int
    total_undesirable_circumstances: int

@app.get("/race_ethnicity_discharge", response_model=List[Race_Ethnicity_Discharge])
async def get_race_ethnicity_discharge():

      try:
        sql_query = """
SELECT
      COALESCE(p.race_or_ethnicity, 'total') AS race_or_ethnicity,
      COUNT(d.patient_id) AS discharge_count,
      SUM(d.higher_level) AS total_higher_level,
      SUM(d.home_community) AS total_home_community,
      SUM(d.hospital) AS total_hospital,
      SUM(d.undesirable_circumstances) AS total_undesirable_circumstances
    FROM
  public.patient p
  JOIN public.discharges d ON p.patient_id = d.patient_id
GROUP BY
  ROLLUP (p.race_or_ethnicity)
ORDER BY
  p.race_or_ethnicity
        """
        
        response = supabase.rpc("exec_sql", {"sql_query": sql_query}).execute()

        return response.data

      except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
      
