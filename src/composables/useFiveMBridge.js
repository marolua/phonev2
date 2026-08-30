import { computed } from 'vue';

const getResourceName = () => {
    if (typeof window === 'undefined' || typeof window.GetParentResourceName !== 'function') {
        return null;
    }

    return window.GetParentResourceName();
};

export const useFiveMBridge = () => {
    const resourceName = computed(getResourceName);
    const isFiveM = computed(() => Boolean(resourceName.value));

    const invoke = async (endpoint, payload = {}) => {
        if (!resourceName.value) return null;

        try {
            const response = await fetch(`https://${resourceName.value}/${endpoint}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload),
            });

            if (!response.ok) return null;
            return await response.json();
        } catch {
            return null;
        }
    };

    return { invoke, isFiveM, resourceName };
};
