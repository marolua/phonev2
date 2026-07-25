<script setup>
const props = defineProps({
    inputType: {
        type: String,
        default: 'number',
        validator: (value) => ['text', 'number'].includes(value),
    },
    inputValue: {
        type: [String, Number],
        default: '0',
    },
    inputPlaceholder: {
        type: String,
        default: '',
    },
})

</script>

<template>
    <!-- <div class="container-prompt-with-texte">
        <div class="prompt-with">
            <div class="top-prompt-with">
                <span class="title-prompt">Un texte court</span>
                <span class="description">Petit description, peut completer la sentence</span>
                <input class="input-prompt" type="text" placeholder="Placeholder" />
            </div>
            <div class="bottom-prompt-with">
                <span class="action-prompt">Valider</span>
            </div>
        </div>
    </div> -->
    
    <!-- <div class="container-prompt-without-texte">
        <div class="prompt-without">
            <div class="top-prompt-without">
                <span class="title-prompt">Supprimer la conversation</span>
                <span class="description">Êtes-vous sur de vouloir supprimer cette conversation?</span>
            </div>
            <div class="bottom-prompt-without">
                <span class="button-prompt">Accepte</span>
                <span class="bar"></span>
                <span class="button-prompt">Refuser</span>
            </div>
        </div>
    </div> -->
    
    <!-- <div class="container-prompt-with-texte-and-choice">
        <div class="prompt-with-choice">
            <div class="top-prompt-with-choice">
                <span class="title-prompt">Donner une Clé</span>
                <span class="description">Inserer l'id de la personne a qui vous voulez donner la clé</span>
                <input class="input-prompt" :type="props.inputType" :value="props.inputValue"
                    :placeholder="props.inputPlaceholder" :min="props.inputType === 'number' ? 0 : undefined" />
            </div>
            <div class="bottom-prompt-with-choice">
                <span class="button-prompt">Annuler</span>
                <span class="bar"></span>
                <span class="button-prompt">Executer</span>
            </div>
        </div>
    </div> -->
</template>

<style lang="scss">
.container-prompt-with-texte {
    position: absolute;
    inset: 0;
    display: flex;
    justify-content: center;
    align-items: center;
    width: 100%;
    height: 100%;
    border-radius: 13.4cqw;
    background-color: rgba(0, 0, 0, 0.38);
    backdrop-filter: blur(0.5cqh);
    -webkit-backdrop-filter: blur(0.5cqh);
    z-index: 50;

    .prompt-with {
        display: flex;
        flex-direction: column;
        width: 67.5%;
        height: 28%;
        box-sizing: border-box;
        overflow: hidden;
        border-radius: 3.5cqw;
        background-color: rgba(40, 40, 40, 0.9);

        .top-prompt-with {
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            box-sizing: border-box;
            width: 100%;
            height: 82%;
            gap: 2cqh;
            padding: 2.5cqh 4cqw 1.5cqh;
            text-align: center;

            .title-prompt {
                font-size: 2.15cqh;
                font-weight: 750;
                line-height: 1.2;
            }

            .description {
                max-width: 95%;
                font-size: 1.7cqh;
                line-height: 1.25;
            }

            .input-prompt {
                width: 100%;
                height: 5.3cqh;
                box-sizing: border-box;
                padding: 0 3cqw;
                border: none;
                border-radius: 1.4cqw;
                outline: none;
                color: white;
                font: 400 1.9cqh "SF Pro Display", sans-serif;
                background-color: rgba(15, 15, 15, 0.9);

                &::placeholder {
                    color: rgba(255, 255, 255, 0.5);
                }
            }
        }

        .bottom-prompt-with {
            display: flex;
            justify-content: center;
            align-items: center;
            width: 100%;
            height: 18%;
            border-top: 0.15cqw solid rgba(128, 128, 128, 0.55);

            .action-prompt {
                font-size: 2cqh;
                font-family: "SF Pro Display";
                font-weight: 600;
                color: rgb(0, 157, 255);

                &:hover {
                    cursor: pointer;
                }
            }
        }
    }
}

.container-prompt-with-texte-and-choice {
    position: absolute;
    inset: 0;
    display: flex;
    justify-content: center;
    align-items: center;
    width: 100%;
    height: 100%;
    border-radius: 13.4cqw;
    background-color: rgba(0, 0, 0, 0.38);
    backdrop-filter: blur(0.5cqh);
    -webkit-backdrop-filter: blur(0.5cqh);
    z-index: 50;

    .prompt-with-choice {
        display: flex;
        flex-direction: column;
        width: 70%;
        height: 28%;
        box-sizing: border-box;
        overflow: hidden;
        border-radius: 3.5cqw;
        background-color: rgba(40, 40, 40, 0.9);

        .top-prompt-with-choice {
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            box-sizing: border-box;
            width: 100%;
            height: 76%;
            gap: 1.5cqh;
            padding: 2.5cqh 4cqw 1.5cqh;
            text-align: center;

            .title-prompt {
                font-size: 2.2cqh;
                font-weight: 750;
                line-height: 1.2;
            }

            .description {
                max-width: 95%;
                font-size: 1.75cqh;
                line-height: 1.25;
            }

            .input-prompt {
                width: 88%;
                height: 4.5cqh;
                box-sizing: border-box;
                padding: 0.5cqh 3cqw;
                border: 0;
                border-radius: 1.4cqw;
                outline: none;
                color: white;
                font: 400 1.9cqh "SF Pro Display", sans-serif;
                background-color: rgba(15, 15, 15, 0.9);
                -moz-appearance: textfield;

                &::-webkit-inner-spin-button,
                &::-webkit-outer-spin-button {
                    margin: 0;
                    -webkit-appearance: none;
                }
            }
        }

        .bottom-prompt-with-choice {
            display: flex;
            justify-content: center;
            align-items: center;
            width: 100%;
            height: 23%;
            gap: 8cqw;
            border-top: 0.15cqw solid rgba(128, 128, 128, 0.55);

            .button-prompt {
                font-size: 2cqh;
                font-family: "SF Pro Display";
                font-weight: 500;
                color: rgb(0, 157, 255);

                &:hover {
                    cursor: pointer;
                }
            }

            .bar {
                width: 0.35cqw;
                height: 3cqh;
                border-radius: 2cqw;
                background-color: rgba(128, 128, 128, 0.65);
            }
        }
    }
}

.container-prompt-without-texte {
    position: absolute;
    inset: 0;
    display: flex;
    justify-content: center;
    align-items: center;
    width: 100%;
    height: 100%;
    border-radius: 13.4cqw;
    background-color: rgba(0, 0, 0, 0.38);
    backdrop-filter: blur(0.5cqh);
    -webkit-backdrop-filter: blur(0.5cqh);
    z-index: 50;

    .prompt-without {
        display: flex;
        flex-direction: column;
        border-radius: 3.5cqw;
        width: 70%;
        box-sizing: border-box;
        height: 20%;
        overflow: hidden;
        background-color: rgba(40, 40, 40, 0.90);

        .top-prompt-without {
            position: relative;
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            box-sizing: border-box;
            padding: 1.5cqh 4cqw 0;
            text-align: center;
            gap: 1cqh;
            height: 64%;
            width: 100%;

            .title-prompt {
                font-size: 2.15cqh;
                font-weight: 750;
                line-height: 1.4;
            }

            .description {
                font-size: 1.7cqh;
                line-height: 1.25;
            }
        }

        .bottom-prompt-without {
            position: relative;
            display: flex;
            justify-content: center;
            gap: 9cqw;
            align-items: center;
            width: 100%;
            height: 35%;

            .button-prompt {
                font-size: 2cqh;
                font-family: "SF Pro Display";
                font-weight: 500;
                color: rgb(0, 157, 255);

                &:hover {
                    cursor: pointer;
                }
            }

            .bar {
                width: 0.35cqw;
                border-radius: 2cqw;
                height: 3cqh;
                background-color: rgba(128, 128, 128, 0.65);
            }
        }
    }
}
</style>
