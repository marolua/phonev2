import { computed } from "vue";

const getResourceName = () => {
  if (
    typeof window === "undefined" ||
    typeof window.GetParentResourceName !== "function"
  ) {
    return null;
  }

  try {
    return window.GetParentResourceName();
  } catch {
    return null;
  }
};

const parseResponse = async (response) => {
  if (!response.ok) return null;

  const body = await response.text();
  if (!body) return { success: true };

  try {
    return JSON.parse(body);
  } catch {
    return body;
  }
};

const getMessagePayload = (event) => event?.detail || event?.data || {};

const getMessageAction = (payload) => String(
  payload?.action || payload?.event || payload?.type || "",
).toLowerCase();

export const useFiveMBridge = () => {
  const resourceName = computed(getResourceName);
  const isFiveM = computed(() => Boolean(resourceName.value));

  const invoke = async (endpoint, payload = {}, options = {}) => {
    if (!resourceName.value) return null;

    try {
      const response = await fetch(
        `https://${resourceName.value}/${endpoint}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
          signal: options.signal,
        },
      );

      return await parseResponse(response);
    } catch {
      return null;
    }
  };

  const listen = (actions, handler) => {
    const acceptedActions = Array.isArray(actions)
      ? actions.map((action) => String(action).toLowerCase())
      : [String(actions).toLowerCase()];
    const listener = (event) => {
      const payload = getMessagePayload(event);
      if (!acceptedActions.includes(getMessageAction(payload))) return;
      handler(payload, event);
    };

    window.addEventListener("message", listener);
    return () => window.removeEventListener("message", listener);
  };

  return { invoke, isFiveM, listen, resourceName };
};
