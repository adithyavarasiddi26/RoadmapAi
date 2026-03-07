
from .prompt import system_prompt_template, user_prompt_template
from langchain_core.prompts import ChatPromptTemplate
from dotenv import load_dotenv
from langchain_openai import ChatOpenAI
import os
from schema.model import RoadmapRequest
load_dotenv()
api_key = os.getenv("OPENAI_API_KEY")
llm = ChatOpenAI(model="gpt-4o", temperature=0.9, api_key=api_key)
prompt = ChatPromptTemplate.from_messages([
    ("system", system_prompt_template),
    ("user", user_prompt_template)
])

async def generate_roadmap_llm(request: RoadmapRequest):
    formatted_prompt = prompt.format(
        goal=request.goal,
        target=request.target_role,
        current_level=request.current_level,
        programming_score=request.prog_score,
        database_score=request.db_score,
        dsa_score=request.dsa_score,
        systemdesign_score=request.sd_score,
        experience=request.experience,
        weekly_hours=request.weekly_hours,
        deadline=request.deadline
        # learning_style and constraints are not used in the current user template
    )

    # use asynchronous invocation so callers can await
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
    
    return content