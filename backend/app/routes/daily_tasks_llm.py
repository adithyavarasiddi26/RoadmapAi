
from .prompt import system_prompt_template_for_daily_tasks, user_prompt_template_for_daily_tasks
from langchain_core.prompts import ChatPromptTemplate
from dotenv import load_dotenv
from langchain_openai import ChatOpenAI
import os
from schema.model import DailyTaskRequest
load_dotenv()
api_key = os.getenv("OPENAI_API_KEY")
llm = ChatOpenAI(model="gpt-4o", temperature=0.9, api_key=api_key)
prompt = ChatPromptTemplate.from_messages([
    ("system", system_prompt_template_for_daily_tasks),
    ("user", user_prompt_template_for_daily_tasks)
])

async def generate_daily_tasks_llm(request: DailyTaskRequest):
    formatted_prompt = prompt.format(
        topic=request.topic,
        goal=request.user_goal,
        target_role=request.target_role,
        current_level=request.current_level,
        current_phase=request.current_phase,
        total_days=request.total_days,
        current_day=request.current_day,
        progress_percentage=request.progress_percentage
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