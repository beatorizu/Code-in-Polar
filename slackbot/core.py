# instantiate Slack client
import re
import threading
import time
import string
from random import *
from slackclient import SlackClient
from datetime import datetime
from pymongo import MongoClient

mongoClient = MongoClient('mongodb+srv://codeinpolar:codeinpolar@codeinpolar-quc9o.mongodb.net/test')
db = mongoClient.get_database('codeinquero')
exercicios = db.get_collection('exercicios')

slack_client = SlackClient('xoxb-358320739216-Ua04LCfZnkz7MzAv8PKXnbJQ')
# starterbot's user ID in Slack: value is assigned after the bot starts up
starterbot_id = None
global id
id = None

# constants
RTM_READ_DELAY = 1 # 1 second delay between reading from RTM
EXAMPLE_COMMAND = "do"
MENTION_REGEX = "^<@(|[WU].+?)>(.*)"

valid_response = ['sim','não','nao']

message = [{
    "title": "Hora de se alongar! Responda com sim ou não para sabermos se realizou a atividade!",
    "text": "Link: ",


}]

def generate_id():

    min_char = 8
    max_char = 12
    allchar = string.ascii_letters + string.punctuation + string.digits
    id = "".join(choice(allchar) for x in range(randint(min_char, max_char)))
    return id


def parse_bot_commands(slack_events,id):


    """
        Parses a list of events coming from the Slack RTM API to find bot commands.
        If a bot command is found, this function returns a tuple of command and channel.
        If its not found, then this function returns None, None.
    """
    for event in slack_events:
        if event["type"] == "message":
            print(event)

            if 'username' in event and event['username'] != 'codeinpolar': continue

            elif 'user' in event:
                message = event['text'].lower()
                user = event['user']
                tmp = {}
                tmp['id'] = id
                tmp['user'] = user

                tmp['datetime'] = datetime.utcnow()
                if message in valid_response:
                    if 'sim' in message:
                        tmp['exercicios'] = True


                    else:
                        tmp['exercicios'] = False
                    exercicios.insert(tmp)
                else:
                    slack_client.api_call(
                        "chat.postMessage",
                        channel=event['channel'],
                        text='Resposta inválida, vá descansar!'
                    )




    return None, None

def parse_direct_mention(message_text):
    """
        Finds a direct mention (a mention that is at the beginning) in message text
        and returns the user ID which was mentioned. If there is no direct mention, returns None
    """
    matches = re.search(MENTION_REGEX, message_text)
    # the first group contains the username, the second group contains the remaining message
    return (matches.group(1), matches.group(2).strip()) if matches else (None, None)

def handle_command(command, channel,id):
    """
        Executes bot command if the command is known
    """
    # Default response is help text for the user
    default_response = "Not sure what you mean. Try *{}*.".format(EXAMPLE_COMMAND)

    # Finds and executes the given command, filling in response
    response = None
    # This is where you start to implement more commands!
    if command.startswith(EXAMPLE_COMMAND):
        response = "Sure...write some more code then I can do that!"

    # Sends the response back to the channel
    slack_client.api_call(
        "chat.postMessage",
        channel=channel,
        text=response or default_response
    )

def send_alongamento_message():
    id = generate_id()
    slack_client.api_call(
        "chat.postMessage",
        channel='teste',
        text='hora de se alongar!',
        attachments=message
    )

if __name__ == "__main__":
    if slack_client.rtm_connect(with_team_state=False):
        print("Starter Bot connected and running!")
        # Read bot's user ID by calling Web API method `auth.test`
        starterbot_id = slack_client.api_call("auth.test")["user_id"]
        threading.Timer(600.0, send_alongamento_message).start()
        id = send_alongamento_message()
        while True:

            command, channel = parse_bot_commands(slack_client.rtm_read(),id)
            if command:
                handle_command(command, channel)
            time.sleep(RTM_READ_DELAY)



    else:
        print("Connection failed. Exception traceback printed above.")




