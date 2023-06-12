import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import authService from '../services/authService';

//Pegando usuário que está salvo no local storage (caso tenha):
const user = JSON.parse(localStorage.getItem("user"));

//Criando objeto com os estados iniciais:
const initialState = {
    //Estado inicial do usuário (vai estar preenchido se existir e "null" se não existir):
    user: user ? user : null,
    //Estados de carregamento (todos irão iniciar como "false"):
    error: false,
    success: false,
    loading: false,
}

//Ação de registrar usuário e fazer login em seguida (na nossa API, quando o usuário é registrado, ele já é logado, pois é gerado um token para ele):
export const register = createAsyncThunk("auth/register",
    async (user, thunkAPI) => {
        //Pegando dados do usuário que vem pela execução do serviço de registro:
        const data = await authService.register(user);
        //Checando possíveis erros:
        if (data.errors) {
            return thunkAPI.rejectWithValue(data.errors[0]); //O que vai ser retornado aqui é o array de erros que enviamos lá do BACK END para o FRONT END. Nessa nossa aplicação, esse array de erros, vai ter sempre apenas um elemento. Então é esse elemento "[0]" que iremos pegar.
        }
        //Retornando usuário se deu tudo certo:
        return data;
    }
)

//Criando slice:
export const authSlice = createSlice({

    //Nome:
    name: "auth",

    //Estado inicial:
    initialState,

    //Ações padrões:
    reducers: {
        //Ação de resetar todos os estados (exceto o usuário):
        reset: (state) => {
            state.loading = false;
            state.error = false;
            state.success = false;
        },
        register
    },

    //Ações Extras:
    extraReducers: (builder) => {
        builder

            //Ações vinculadas à ação de registro
            //Ação de requisição de registro pendente (carregando):
            .addCase(register.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            //Ação de requisição de registro completa (usuário vai ser recebido como carga):
            .addCase(register.fulfilled, (state, action) => {
                state.loading = false;
                state.success = true;
                state.error = null;
                state.user = action.payload;
            })
            //Ação de requisição de registro com erro (erro vai ser recebido como carga):
            .addCase(register.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
                state.user = null;
            })


    },
});

//Exportando slice/reducers: 
export const { reset } = authSlice.actions;
export default authSlice.reducer;