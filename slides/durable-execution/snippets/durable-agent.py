@DBOS.workflow()
def durable_agent(request: AgentStartRequest):
    # Do work...
    agent_status = AgentStatus(name=request.name, task=request.task,
                               status="working")
    DBOS.set_event(AGENT_STATUS, agent_status)

    # Pause: wait for human approval (survives crashes)
    agent_status.status = "pending_approval"
    DBOS.set_event(AGENT_STATUS, agent_status)
    approval = DBOS.recv(timeout_seconds=3600)

    if approval is None or approval.response == "deny":
        raise Exception("Agent denied or timed out")

    # Approved — continue working
    agent_status.status = "working"
    DBOS.set_event(AGENT_STATUS, agent_status)
    return "Agent successful"
