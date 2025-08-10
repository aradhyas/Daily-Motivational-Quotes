import streamlit as st
from openai import OpenAI
import os
from dotenv import load_dotenv

load_dotenv()
api_key = os.getenv("OPENAI_API_KEY")
client = OpenAI(api_key=api_key)

st.set_page_config(page_title="Mood Quote Generator", page_icon="🌤️")
st.title("🌤️ Mood-Based Quote Generator")
st.markdown("How do you feel today?")

moods = ["happy", "sad", "anxious", "angry", "motivated", "lonely", "grateful", "tired"]
selected_mood = st.selectbox("Select your current mood:", moods)

if st.button("✨ Generate Quote"):
    try:
        prompt = (
            f"Give me a short, meaningful, and original quote for someone who is feeling {selected_mood}. "
            "Make it poetic and encouraging. Keep it under 25 words."
        )

        response = client.chat.completions.create(
            model="gpt-3.5-turbo",
            messages=[{"role": "user", "content": prompt}],
            temperature=0.8
        )
        quote = response.choices[0].message.content.strip()

        st.success("Here's your quote:")
        st.markdown(f"> _{quote}_")

    except Exception as e:
        st.error(f"Error: {e}")
