import json

from fastapi import FastAPI
from dotenv import load_dotenv
from langchain_openai import ChatOpenAI
from openai import api_key
from langchain_core.prompts import ChatPromptTemplate
from prompt import system_prompt_template, user_prompt_template
from schema.model import RoadmapRequest
import os
load_dotenv()
api_key = os.getenv("OPENAI_API_KEY")
llm = ChatOpenAI(model="gpt-4o", temperature=0.9)
prompt = ChatPromptTemplate.from_messages([
    ("system", system_prompt_template),
    ("user", user_prompt_template)
])
app = FastAPI()

@app.post("/generate_roadmap")
async def generate_roadmap(data: RoadmapRequest):
    
    formatted_prompt = prompt.format(
        goal=data.goal,
        target_role=data.target_role,
        current_level=data.current_level,
        prog_score=data.prog_score,
        db_score=data.db_score,
        dsa_score=data.dsa_score,
        sd_score=data.sd_score,
        experience=data.experience,
        weekly_hours=data.weekly_hours,
        deadline=data.deadline,
        learning_style=data.learning_style,
        constraints=data.constraints
    )

    response = await llm.ainvoke(formatted_prompt)
    
    # Debug: Check what we're getting
    print("Response type:", type(response))
    print("Response content:", response.content)
    
    # Strip markdown code blocks if present
    content = response.content.strip()
    if content.startswith("```json"):
        content = content[7:]  # Remove ```json
    elif content.startswith("```"):
        content = content[3:]  # Remove ```
    
    if content.endswith("```"):
        content = content[:-3]  # Remove closing ```
    
    content = content.strip()
    roadmap_data = json.loads(content)

    return {
        "roadmap": roadmap_data
    }
